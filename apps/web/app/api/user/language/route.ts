import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { getLanguageByCode } from "@/data/languages";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { nativeLanguage, nativeLanguageName } = body;

    if (!nativeLanguage || typeof nativeLanguage !== "string") {
      return NextResponse.json(
        { error: "Native language code is required" },
        { status: 400 }
      );
    }

    if (!nativeLanguageName || typeof nativeLanguageName !== "string") {
      return NextResponse.json(
        { error: "Native language name is required" },
        { status: 400 }
      );
    }

    const languageData = getLanguageByCode(nativeLanguage);
    if (!languageData) {
      return NextResponse.json({ error: "Invalid language code" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.nativeLanguage = nativeLanguage;
    user.nativeLanguageName = nativeLanguageName;
    user.onboardingCompleted = true;

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        nativeLanguage: user.nativeLanguage,
        nativeLanguageName: user.nativeLanguageName,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Error updating user language:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
