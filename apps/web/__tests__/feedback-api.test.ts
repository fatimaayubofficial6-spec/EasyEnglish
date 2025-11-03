/**
 * @jest-environment node
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ExerciseAttempt, Paragraph, User } from "../lib/models";
import { ExerciseType, DifficultyLevel, Language, SubscriptionTier, SubscriptionStatus } from "../types/models";

// Mock NextAuth
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next-auth/providers/google", () => ({
  default: jest.fn(() => ({
    id: "google",
    name: "Google",
    type: "oauth",
  })),
}));

describe("Exercise Attempt Retrieval", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Paragraph.deleteMany({});
    await ExerciseAttempt.deleteMany({});
  });

  describe("Exercise Attempt Model", () => {
    it("should create and retrieve an exercise attempt with enhanced feedback", async () => {
      // Create a user
      const user = await User.create({
        email: "test@example.com",
        name: "Test User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      // Create a paragraph
      const paragraph = await Paragraph.create({
        title: "Test Paragraph",
        content: "This is the original text that needs to be at least fifty characters long for the validation.",
        difficulty: DifficultyLevel.INTERMEDIATE,
        language: Language.ENGLISH,
        topics: ["Technology", "Business"],
        isActive: true,
      });

      // Create an exercise attempt with enhanced feedback
      const attempt = await ExerciseAttempt.create({
        userId: user._id.toString(),
        paragraphId: paragraph._id.toString(),
        exerciseType: ExerciseType.TRANSLATION,
        userAnswer: "This is my translation",
        correctAnswer: "This is the correct translation",
        score: 85,
        feedback: "Great work! Your translation is accurate.",
        aiAnalysis: {
          strengths: ["Good vocabulary", "Correct grammar"],
          improvements: ["Could be more natural"],
          suggestions: ["Try using more idiomatic expressions"],
          correctedVersion: "This is the corrected translation",
          grammarMistakes: [
            {
              mistake: "is my",
              correction: "is the",
              explanation: "Use 'the' for definite articles",
            },
          ],
          tenses: ["Present Simple", "Past Perfect"],
          keyVocabulary: [
            {
              word: "translation",
              definition: "The process of converting text from one language to another",
              example: "The translation was accurate.",
            },
          ],
        },
        timeSpentSeconds: 120,
        completedAt: new Date("2024-01-01T12:00:00Z"),
      });

      // Verify the attempt was created with all fields
      expect(attempt).toBeDefined();
      expect(attempt.userId).toBe(user._id.toString());
      expect(attempt.paragraphId).toBe(paragraph._id.toString());
      expect(attempt.score).toBe(85);
      expect(attempt.aiAnalysis?.correctedVersion).toBe("This is the corrected translation");
      expect(attempt.aiAnalysis?.grammarMistakes).toHaveLength(1);
      expect(attempt.aiAnalysis?.grammarMistakes?.[0].mistake).toBe("is my");
      expect(attempt.aiAnalysis?.tenses).toHaveLength(2);
      expect(attempt.aiAnalysis?.tenses).toContain("Present Simple");
      expect(attempt.aiAnalysis?.keyVocabulary).toHaveLength(1);
      expect(attempt.aiAnalysis?.keyVocabulary?.[0].word).toBe("translation");

      // Retrieve the attempt
      const retrieved = await ExerciseAttempt.findById(attempt._id).lean();
      expect(retrieved).toBeDefined();
      expect(retrieved?.aiAnalysis?.correctedVersion).toBe("This is the corrected translation");
      expect(retrieved?.aiAnalysis?.grammarMistakes).toHaveLength(1);
      expect(retrieved?.aiAnalysis?.tenses).toHaveLength(2);
      expect(retrieved?.aiAnalysis?.keyVocabulary).toHaveLength(1);
    });

    it("should create attempt with empty enhanced feedback arrays", async () => {
      const user = await User.create({
        email: "test2@example.com",
        name: "Test User 2",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      const paragraph = await Paragraph.create({
        title: "Test Paragraph 2",
        content: "Another test text that is long enough to pass the minimum character validation requirement.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
        topics: ["General"],
        isActive: true,
      });

      const attempt = await ExerciseAttempt.create({
        userId: user._id.toString(),
        paragraphId: paragraph._id.toString(),
        exerciseType: ExerciseType.TRANSLATION,
        userAnswer: "My answer",
        score: 50,
        feedback: "Good effort!",
        aiAnalysis: {
          strengths: ["You tried"],
          improvements: [],
          suggestions: [],
        },
        completedAt: new Date(),
      });

      expect(attempt.aiAnalysis?.grammarMistakes).toEqual([]);
      expect(attempt.aiAnalysis?.tenses).toEqual([]);
      expect(attempt.aiAnalysis?.keyVocabulary).toEqual([]);
    });

    it("should query attempts by userId", async () => {
      const user1 = await User.create({
        email: "user1@example.com",
        name: "User One",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      const user2 = await User.create({
        email: "user2@example.com",
        name: "User Two",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      const paragraph = await Paragraph.create({
        title: "Shared Paragraph",
        content: "Shared content for testing that is long enough to meet the minimum character requirements.",
        difficulty: DifficultyLevel.INTERMEDIATE,
        language: Language.ENGLISH,
        topics: ["Test"],
        isActive: true,
      });

      // Create attempts for both users
      await ExerciseAttempt.create({
        userId: user1._id.toString(),
        paragraphId: paragraph._id.toString(),
        exerciseType: ExerciseType.TRANSLATION,
        userAnswer: "User 1 answer",
        score: 90,
        feedback: "Excellent!",
        completedAt: new Date(),
      });

      await ExerciseAttempt.create({
        userId: user2._id.toString(),
        paragraphId: paragraph._id.toString(),
        exerciseType: ExerciseType.TRANSLATION,
        userAnswer: "User 2 answer",
        score: 80,
        feedback: "Very good!",
        completedAt: new Date(),
      });

      // Query attempts for user1
      const user1Attempts = await ExerciseAttempt.find({ userId: user1._id.toString() }).lean();
      expect(user1Attempts).toHaveLength(1);
      expect(user1Attempts[0].userAnswer).toBe("User 1 answer");

      // Query attempts for user2
      const user2Attempts = await ExerciseAttempt.find({ userId: user2._id.toString() }).lean();
      expect(user2Attempts).toHaveLength(1);
      expect(user2Attempts[0].userAnswer).toBe("User 2 answer");
    });

    it("should validate score range", async () => {
      const user = await User.create({
        email: "test3@example.com",
        name: "Test User 3",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      const paragraph = await Paragraph.create({
        title: "Test Paragraph 3",
        content: "Test content for validation testing that meets the minimum character requirement for paragraphs.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
        topics: ["Test"],
        isActive: true,
      });

      // Score over 100 should fail
      await expect(
        ExerciseAttempt.create({
          userId: user._id.toString(),
          paragraphId: paragraph._id.toString(),
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Test",
          score: 101,
          completedAt: new Date(),
        })
      ).rejects.toThrow();

      // Score under 0 should fail
      await expect(
        ExerciseAttempt.create({
          userId: user._id.toString(),
          paragraphId: paragraph._id.toString(),
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Test",
          score: -1,
          completedAt: new Date(),
        })
      ).rejects.toThrow();

      // Valid score should pass
      const validAttempt = await ExerciseAttempt.create({
        userId: user._id.toString(),
        paragraphId: paragraph._id.toString(),
        exerciseType: ExerciseType.TRANSLATION,
        userAnswer: "Test",
        score: 75,
        completedAt: new Date(),
      });

      expect(validAttempt.score).toBe(75);
    });
  });
});
