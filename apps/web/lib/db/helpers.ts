import connectDB from "./mongoose";
import { User, Paragraph, TranslationCache, ExerciseAttempt, AdminUser } from "../models";
import {
  IUser,
  IParagraph,
  ITranslationCache,
  IExerciseAttempt,
  IAdminUser,
  DifficultyLevel,
  Language,
  SubscriptionTier,
  SubscriptionStatus,
  ExerciseType,
} from "@/types/models";

// User Helpers

export async function getUserById(userId: string) {
  await connectDB();
  return User.findById(userId).lean();
}

export async function getUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email }).lean();
}

export async function getUserByGoogleId(googleId: string) {
  await connectDB();
  return User.findOne({ googleId }).lean();
}

export async function updateUserSubscription(
  userId: string,
  data: {
    subscriptionTier?: SubscriptionTier;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    stripeCustomerId?: string;
  }
) {
  await connectDB();
  return User.findByIdAndUpdate(userId, data, { new: true }).lean();
}

export async function updateUserOnboarding(
  userId: string,
  data: {
    nativeLanguage?: Language;
    learningLanguage?: Language;
    onboardingCompleted?: boolean;
  }
) {
  await connectDB();
  return User.findByIdAndUpdate(userId, data, { new: true }).lean();
}

// Paragraph Helpers

export async function getActiveParagraphs(
  filters?: {
    difficulty?: DifficultyLevel;
    language?: Language;
    topics?: string[];
    limit?: number;
    skip?: number;
  }
) {
  await connectDB();
  const query: Record<string, unknown> = { isActive: true };

  if (filters?.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters?.language) {
    query.language = filters.language;
  }

  if (filters?.topics && filters.topics.length > 0) {
    query.topics = { $in: filters.topics };
  }

  return Paragraph.find(query)
    .sort({ createdAt: -1 })
    .limit(filters?.limit || 20)
    .skip(filters?.skip || 0)
    .lean();
}

export async function getParagraphById(paragraphId: string) {
  await connectDB();
  return Paragraph.findById(paragraphId).lean();
}

export async function createParagraph(data: Partial<IParagraph>) {
  await connectDB();
  const paragraph = new Paragraph(data);
  return paragraph.save();
}

export async function updateParagraph(
  paragraphId: string,
  data: Partial<IParagraph>
) {
  await connectDB();
  return Paragraph.findByIdAndUpdate(paragraphId, data, { new: true }).lean();
}

export async function deactivateParagraph(paragraphId: string) {
  await connectDB();
  return Paragraph.findByIdAndUpdate(paragraphId, { isActive: false }, { new: true }).lean();
}

// Translation Cache Helpers

export async function getCachedTranslation(
  text: string,
  sourceLang: Language,
  targetLang: Language
) {
  await connectDB();
  return TranslationCache.findOne({
    text,
    sourceLang,
    targetLang,
    expiresAt: { $gt: new Date() },
  }).lean();
}

export async function setCachedTranslation(
  text: string,
  sourceLang: Language,
  targetLang: Language,
  translation: string,
  provider: string = "openai"
) {
  await connectDB();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return TranslationCache.findOneAndUpdate(
    { text, sourceLang, targetLang },
    { translation, provider, expiresAt },
    { upsert: true, new: true }
  );
}

// Exercise Attempt Helpers

export async function createExerciseAttempt(
  data: Partial<IExerciseAttempt>
) {
  await connectDB();
  const attempt = new ExerciseAttempt(data);
  return attempt.save();
}

export async function getUserExerciseAttempts(
  userId: string,
  filters?: {
    exerciseType?: ExerciseType;
    paragraphId?: string;
    limit?: number;
    skip?: number;
  }
) {
  await connectDB();
  const query: Record<string, unknown> = { userId };

  if (filters?.exerciseType) {
    query.exerciseType = filters.exerciseType;
  }

  if (filters?.paragraphId) {
    query.paragraphId = filters.paragraphId;
  }

  return ExerciseAttempt.find(query)
    .sort({ completedAt: -1 })
    .limit(filters?.limit || 50)
    .skip(filters?.skip || 0)
    .lean();
}

export async function getUserExerciseStats(userId: string): Promise<{
  totalAttempts: number;
  averageScore: number;
  attemptsByType: Record<string, number>;
}> {
  await connectDB();

  const attempts = await ExerciseAttempt.find({ userId }).lean();

  const totalAttempts = attempts.length;
  const averageScore =
    totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
      : 0;

  const attemptsByType: Record<string, number> = {};
  attempts.forEach((attempt) => {
    attemptsByType[attempt.exerciseType] = (attemptsByType[attempt.exerciseType] || 0) + 1;
  });

  return {
    totalAttempts,
    averageScore: Math.round(averageScore * 100) / 100,
    attemptsByType,
  };
}

// Admin User Helpers

export async function isUserAdmin(userId: string): Promise<boolean> {
  await connectDB();
  const adminUser = await AdminUser.findOne({ userId, isActive: true }).lean();
  return !!adminUser;
}

export async function getAdminUser(userId: string) {
  await connectDB();
  return AdminUser.findOne({ userId }).lean();
}

export async function createAdminUser(data: Partial<IAdminUser>) {
  await connectDB();
  const adminUser = new AdminUser(data);
  return adminUser.save();
}

export async function updateAdminUser(
  userId: string,
  data: Partial<IAdminUser>
) {
  await connectDB();
  return AdminUser.findOneAndUpdate({ userId }, data, { new: true }).lean();
}

export async function deactivateAdminUser(userId: string) {
  await connectDB();
  return AdminUser.findOneAndUpdate({ userId }, { isActive: false }, { new: true }).lean();
}

export async function getAllAdmins(
  filters?: { isActive?: boolean; limit?: number; skip?: number }
) {
  await connectDB();
  const query: Record<string, unknown> = {};

  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  return AdminUser.find(query)
    .sort({ createdAt: -1 })
    .limit(filters?.limit || 50)
    .skip(filters?.skip || 0)
    .lean();
}
