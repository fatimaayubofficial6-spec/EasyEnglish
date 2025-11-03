import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import Paragraph from "@/lib/models/Paragraph";
import TranslationCache from "@/lib/models/TranslationCache";
import { translateText, isGeminiConfigured } from "@/lib/ai/gemini";
import { Language } from "@/types/models";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    // Fetch paragraph
    const paragraph = await Paragraph.findOne({ _id: id, isActive: true }).lean();

    if (!paragraph) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    // Prepare response data
    const responseData: {
      id: string;
      title: string;
      content: string;
      difficulty: string;
      language: string;
      topics: string[];
      wordCount: number;
      estimatedMinutes: number;
      translation?: string;
      translationLanguage?: string;
      translationError?: string;
    } = {
      id: paragraph._id.toString(),
      title: paragraph.title,
      content: paragraph.content,
      difficulty: paragraph.difficulty,
      language: paragraph.language,
      topics: paragraph.topics,
      wordCount: paragraph.wordCount,
      estimatedMinutes: Math.ceil(paragraph.wordCount / 50),
    };

    // Get translation if user has a native language set
    if (user.nativeLanguage && user.nativeLanguage !== paragraph.language) {
      const sourceLang = paragraph.language;
      const targetLang = user.nativeLanguage;
      const targetLangName = user.nativeLanguageName;

      // Check translation cache first
      const cachedTranslation = await TranslationCache.findOne({
        text: paragraph.content,
        sourceLang: sourceLang as Language,
        targetLang: targetLang as Language,
        expiresAt: { $gt: new Date() }, // Not expired
      }).lean();

      if (cachedTranslation) {
        console.log("Translation cache hit for paragraph:", id);
        responseData.translation = cachedTranslation.translation;
        responseData.translationLanguage = targetLang;
      } else {
        console.log("Translation cache miss for paragraph:", id);

        if (!isGeminiConfigured()) {
          responseData.translationError = "Translation service not configured";
        } else {
          // Call Gemini for translation
          const translationResult = await translateText(
            paragraph.content,
            sourceLang,
            targetLang,
            targetLangName
          );

          if (translationResult.success && translationResult.translation) {
            responseData.translation = translationResult.translation;
            responseData.translationLanguage = targetLang;

            // Store in cache for future use
            try {
              await TranslationCache.create({
                text: paragraph.content,
                sourceLang: sourceLang as Language,
                targetLang: targetLang as Language,
                translation: translationResult.translation,
                provider: "gemini",
              });
              console.log("Translation cached successfully");
            } catch (cacheError) {
              // Log but don't fail the request if caching fails
              console.error("Failed to cache translation:", cacheError);
            }
          } else {
            responseData.translationError =
              translationResult.error || "Translation failed";
          }
        }
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}
