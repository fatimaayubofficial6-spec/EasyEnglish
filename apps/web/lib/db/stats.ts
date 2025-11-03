import connectDB from "./mongoose";
import ExerciseAttempt from "../models/ExerciseAttempt";

export interface UserStats {
  exercisesCompleted: number;
  currentStreak: number;
  totalAttempts: number;
  averageScore: number;
  pdfPages: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  await connectDB();

  // Get all exercise attempts for the user
  const attempts = await ExerciseAttempt.find({ userId })
    .sort({ completedAt: -1 })
    .lean();

  // Calculate unique exercises completed (score >= 70)
  const completedParagraphs = new Set<string>();
  attempts.forEach((attempt) => {
    if (attempt.score >= 70) {
      completedParagraphs.add(attempt.paragraphId.toString());
    }
  });

  // Calculate average score
  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const averageScore = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0;

  // Calculate current streak
  const currentStreak = calculateStreak(attempts);

  return {
    exercisesCompleted: completedParagraphs.size,
    currentStreak,
    totalAttempts: attempts.length,
    averageScore,
    pdfPages: 0, // Placeholder for future PDF feature
  };
}

function calculateStreak(attempts: Array<{ completedAt: Date }>): number {
  if (attempts.length === 0) return 0;

  // Get unique dates (only date part, not time)
  const uniqueDates = Array.from(
    new Set(
      attempts.map((attempt) => {
        const date = new Date(attempt.completedAt);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      })
    )
  ).sort((a, b) => b - a); // Sort descending (most recent first)

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const yesterday = todayDate - 24 * 60 * 60 * 1000;

  // Check if most recent activity is today or yesterday
  const mostRecentDate = uniqueDates[0];
  if (mostRecentDate !== todayDate && mostRecentDate !== yesterday) {
    return 0; // Streak is broken
  }

  let streak = 0;
  let expectedDate = mostRecentDate;

  for (const date of uniqueDates) {
    if (date === expectedDate) {
      streak++;
      expectedDate -= 24 * 60 * 60 * 1000; // Move to previous day
    } else if (date < expectedDate) {
      break; // Gap in streak
    }
  }

  return streak;
}

export async function getAllTopics(): Promise<string[]> {
  await connectDB();
  
  const { default: Paragraph } = await import("../models/Paragraph");
  
  // Get all active paragraphs and extract unique topics
  const paragraphs = await Paragraph.find({ isActive: true })
    .select("topics")
    .lean();

  const topicsSet = new Set<string>();
  paragraphs.forEach((paragraph) => {
    paragraph.topics.forEach((topic: string) => topicsSet.add(topic));
  });

  return Array.from(topicsSet).sort();
}
