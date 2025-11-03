import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import Paragraph from "@/lib/models/Paragraph";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import { DifficultyLevel } from "@/types/models";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");

    // Build query
    const query: Record<string, unknown> = {
      isActive: true,
      language: "en", // Filter by user's learning language in future
    };

    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }

    if (topic && topic !== "all") {
      query.topics = topic;
    }

    // Fetch paragraphs
    const paragraphs = await Paragraph.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Get user's exercise attempts to show progress
    const paragraphIds = paragraphs.map((p) => p._id.toString());
    const attempts = await ExerciseAttempt.find({
      userId: user.id,
      paragraphId: { $in: paragraphIds },
    })
      .sort({ completedAt: -1 })
      .lean();

    // Create a map of paragraph progress
    const progressMap = new Map<string, { attempted: boolean; completed: boolean; bestScore: number }>();

    attempts.forEach((attempt) => {
      const paragraphId = attempt.paragraphId.toString();
      const existing = progressMap.get(paragraphId);

      if (!existing) {
        progressMap.set(paragraphId, {
          attempted: true,
          completed: attempt.score >= 70,
          bestScore: attempt.score,
        });
      } else {
        progressMap.set(paragraphId, {
          attempted: true,
          completed: existing.completed || attempt.score >= 70,
          bestScore: Math.max(existing.bestScore, attempt.score),
        });
      }
    });

    // Enhance paragraphs with progress data
    const exercises = paragraphs.map((paragraph) => {
      const paragraphId = paragraph._id.toString();
      const progress = progressMap.get(paragraphId) || {
        attempted: false,
        completed: false,
        bestScore: 0,
      };

      // Calculate estimated time (1 minute per 50 words)
      const estimatedMinutes = Math.ceil(paragraph.wordCount / 50);

      return {
        id: paragraphId,
        title: paragraph.title,
        difficulty: paragraph.difficulty,
        topics: paragraph.topics,
        wordCount: paragraph.wordCount,
        estimatedMinutes,
        attempted: progress.attempted,
        completed: progress.completed,
        bestScore: progress.bestScore,
      };
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
