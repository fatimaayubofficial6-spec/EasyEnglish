import { Document } from "mongoose";

// Enums
export enum SubscriptionTier {
  FREE = "free",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  TRIAL = "trial",
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum Language {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  PORTUGUESE = "pt",
  RUSSIAN = "ru",
  CHINESE = "zh",
  JAPANESE = "ja",
  KOREAN = "ko",
}

export enum ExerciseType {
  TRANSLATION = "translation",
  GAP_FILL = "gap_fill",
  REWRITE = "rewrite",
  COMPREHENSION = "comprehension",
}

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

// User Interface
export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  googleId?: string;
  nativeLanguage?: Language;
  learningLanguage: Language;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  nextBillingDate?: Date;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Paragraph Interface
export interface IParagraph extends Document {
  _id: string;
  title: string;
  content: string;
  difficulty: DifficultyLevel;
  language: Language;
  topics: string[];
  wordCount: number;
  isActive: boolean;
  metadata?: {
    source?: string;
    author?: string;
    publicationDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// TranslationCache Interface
export interface ITranslationCache extends Document {
  _id: string;
  text: string;
  sourceLang: Language;
  targetLang: Language;
  translation: string;
  provider: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ExerciseAttempt Interface
export interface IExerciseAttempt extends Document {
  _id: string;
  userId: string;
  paragraphId: string;
  exerciseType: ExerciseType;
  userAnswer: string;
  correctAnswer?: string;
  score: number;
  feedback?: string;
  aiAnalysis?: {
    strengths?: string[];
    improvements?: string[];
    suggestions?: string[];
  };
  timeSpentSeconds?: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// AdminUser Interface
export interface IAdminUser extends Document {
  _id: string;
  userId: string;
  role: AdminRole;
  permissions: string[];
  notes?: string;
  createdBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
