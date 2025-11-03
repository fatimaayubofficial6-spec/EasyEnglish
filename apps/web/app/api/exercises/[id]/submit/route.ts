import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import Paragraph from "@/lib/models/Paragraph";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import User from "@/lib/models/User";
import { generateFeedback, isGeminiConfigured } from "@/lib/ai/gemini";
import { ExerciseType, SubscriptionStatus } from "@/types/models";

interface SubmitExerciseBody {
  exerciseType: ExerciseType;
  userAnswer: string;
  correctAnswer?: string;
  timeSpentSeconds?: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription status
    if (user.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    // Parse request body
    let body: SubmitExerciseBody;
    try {
      body = await request.json();
    } catch (_error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { exerciseType, userAnswer, correctAnswer, timeSpentSeconds } = body;

    // Validate required fields
    if (!exerciseType || !userAnswer) {
      return NextResponse.json(
        { error: "exerciseType and userAnswer are required" },
        { status: 400 }
      );
    }

    if (!Object.values(ExerciseType).includes(exerciseType)) {
      return NextResponse.json({ error: "Invalid exercise type" }, { status: 400 });
    }

    if (userAnswer.trim().length === 0) {
      return NextResponse.json(
        { error: "User answer cannot be empty" },
        { status: 400 }
      );
    }

    // Fetch paragraph
    const paragraph = await Paragraph.findOne({ _id: id, isActive: true }).lean();

    if (!paragraph) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    // Generate AI feedback
    let score = 0;
    let feedbackText = "";
    let aiAnalysis = {
      strengths: [] as string[],
      improvements: [] as string[],
      suggestions: [] as string[],
    };

    if (!isGeminiConfigured()) {
      console.warn("Gemini API not configured, using fallback feedback");
      score = 50;
      feedbackText = "AI feedback service is currently unavailable. Your submission has been recorded.";
      aiAnalysis = {
        strengths: ["You completed the exercise"],
        improvements: ["AI feedback unavailable - please try again later"],
        suggestions: ["Contact support if this issue persists"],
      };
    } else {
      const feedbackResult = await generateFeedback(
        exerciseType,
        paragraph.content,
        userAnswer,
        correctAnswer
      );

      if (feedbackResult.success && feedbackResult.feedback) {
        score = feedbackResult.feedback.score;
        feedbackText = feedbackResult.feedback.overallFeedback;
        aiAnalysis = {
          strengths: feedbackResult.feedback.strengths,
          improvements: feedbackResult.feedback.improvements,
          suggestions: feedbackResult.feedback.suggestions,
          correctedVersion: feedbackResult.feedback.correctedVersion,
          grammarMistakes: feedbackResult.feedback.grammarMistakes,
          tenses: feedbackResult.feedback.tenses,
          keyVocabulary: feedbackResult.feedback.keyVocabulary,
        };
      } else {
        console.error("Feedback generation failed:", feedbackResult.error);
        score = 50;
        feedbackText = "Unable to generate detailed feedback at this time. Your submission has been recorded.";
        aiAnalysis = {
          strengths: ["You completed the exercise"],
          improvements: ["AI feedback temporarily unavailable"],
          suggestions: ["Try submitting again or contact support"],
        };
      }
    }

    // Store exercise attempt
    const attempt = await ExerciseAttempt.create({
      userId: user.id,
      paragraphId: id,
      exerciseType,
      userAnswer,
      correctAnswer: correctAnswer || undefined,
      score,
      feedback: feedbackText,
      aiAnalysis,
      timeSpentSeconds: timeSpentSeconds || undefined,
      completedAt: new Date(),
    });

    // Update user stats
    await updateUserStats(user.id);

    // TODO: Trigger PDF update job (placeholder for future implementation)
    // This would enqueue a background job to regenerate user's PDF
    // For now, we just log it
    console.log(`PDF update needed for user ${user.id} after exercise completion`);

    // Return response
    return NextResponse.json({
      success: true,
      attemptId: attempt._id.toString(),
      score,
      feedback: feedbackText,
      aiAnalysis,
      completed: score >= 70, // Exercise is considered completed if score >= 70
    });
  } catch (error) {
    console.error("Error submitting exercise:", error);
    return NextResponse.json(
      { error: "Failed to submit exercise" },
      { status: 500 }
    );
  }
}

/**
 * Update user statistics after exercise completion
 * This could be expanded to include more sophisticated tracking
 */
async function updateUserStats(userId: string): Promise<void> {
  try {
    // Update lastExerciseDate on User model
    await User.findOneAndUpdate(
      { _id: userId },
      { lastExerciseDate: new Date() },
      { new: true }
    );

    // Note: Other stats like total_exercises_completed and current_streak_days
    // are calculated dynamically from ExerciseAttempts in lib/db/stats.ts
    // This keeps the data normalized and prevents inconsistencies

    console.log(`User stats updated for user ${userId}`);
  } catch (error) {
    console.error("Failed to update user stats:", error);
    // Don't throw - this is not critical enough to fail the whole request
  }
}
