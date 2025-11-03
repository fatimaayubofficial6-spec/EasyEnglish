import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import Paragraph from "@/lib/models/Paragraph";

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
      return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 });
    }

    // Fetch the attempt with lean for better performance
    const attempt = await ExerciseAttempt.findOne({
      _id: id,
      userId: user.id,
    }).lean();

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Fetch the associated paragraph
    const paragraph = await Paragraph.findById(attempt.paragraphId).lean();

    if (!paragraph) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    // Return the attempt with paragraph data
    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt._id.toString(),
        userId: attempt.userId,
        paragraphId: attempt.paragraphId,
        exerciseType: attempt.exerciseType,
        userAnswer: attempt.userAnswer,
        correctAnswer: attempt.correctAnswer,
        score: attempt.score,
        feedback: attempt.feedback,
        aiAnalysis: attempt.aiAnalysis,
        timeSpentSeconds: attempt.timeSpentSeconds,
        completedAt: attempt.completedAt,
        createdAt: attempt.createdAt,
      },
      paragraph: {
        id: paragraph._id.toString(),
        title: paragraph.title,
        content: paragraph.content,
        difficulty: paragraph.difficulty,
        language: paragraph.language,
        topics: paragraph.topics,
      },
    });
  } catch (error) {
    console.error("Error fetching exercise attempt:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise attempt" },
      { status: 500 }
    );
  }
}
