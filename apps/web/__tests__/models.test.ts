import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { User, Paragraph, TranslationCache, ExerciseAttempt, AdminUser } from "../lib/models";
import {
  SubscriptionTier,
  SubscriptionStatus,
  DifficultyLevel,
  Language,
  ExerciseType,
  AdminRole,
} from "../types/models";

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

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("User Model", () => {
  it("should create a valid user", async () => {
    const userData = {
      email: "test@example.com",
      name: "Test User",
      googleId: "google123",
      learningLanguage: Language.ENGLISH,
      subscriptionTier: SubscriptionTier.FREE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    };

    const user = await User.create(userData);
    expect(user._id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.onboardingCompleted).toBe(false);
  });

  it("should enforce required fields", async () => {
    const userData = {
      name: "Test User",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should enforce unique email", async () => {
    const userData = {
      email: "test@example.com",
      learningLanguage: Language.ENGLISH,
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should validate email format", async () => {
    const userData = {
      email: "invalid-email",
      learningLanguage: Language.ENGLISH,
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should enforce enum values for subscription tier", async () => {
    const userData = {
      email: "test@example.com",
      learningLanguage: Language.ENGLISH,
      subscriptionTier: "invalid-tier",
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should allow sparse unique index on googleId", async () => {
    const user1 = await User.create({
      email: "test1@example.com",
      learningLanguage: Language.ENGLISH,
    });

    const user2 = await User.create({
      email: "test2@example.com",
      learningLanguage: Language.ENGLISH,
    });

    expect(user1.googleId).toBeUndefined();
    expect(user2.googleId).toBeUndefined();
  });
});

describe("Paragraph Model", () => {
  it("should create a valid paragraph", async () => {
    const paragraphData = {
      title: "Test Paragraph",
      content: "This is a test paragraph with enough content to meet the minimum length requirement.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
      topics: ["test", "example"],
      isActive: true,
    };

    const paragraph = await Paragraph.create(paragraphData);
    expect(paragraph._id).toBeDefined();
    expect(paragraph.title).toBe(paragraphData.title);
    expect(paragraph.wordCount).toBeGreaterThan(0);
  });

  it("should auto-calculate word count", async () => {
    const paragraphData = {
      title: "Test Paragraph",
      content: "This is a test paragraph with exactly ten words total.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
    };

    const paragraph = await Paragraph.create(paragraphData);
    expect(paragraph.wordCount).toBe(10);
  });

  it("should enforce minimum content length", async () => {
    const paragraphData = {
      title: "Test Paragraph",
      content: "Too short",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
    };

    await expect(Paragraph.create(paragraphData)).rejects.toThrow();
  });

  it("should enforce maximum title length", async () => {
    const paragraphData = {
      title: "a".repeat(201),
      content: "This is a test paragraph with enough content to meet the minimum length requirement.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
    };

    await expect(Paragraph.create(paragraphData)).rejects.toThrow();
  });

  it("should limit topics to 10", async () => {
    const paragraphData = {
      title: "Test Paragraph",
      content: "This is a test paragraph with enough content to meet the minimum length requirement.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
      topics: Array(11).fill("topic"),
    };

    await expect(Paragraph.create(paragraphData)).rejects.toThrow();
  });

  it("should default isActive to true", async () => {
    const paragraphData = {
      title: "Test Paragraph",
      content: "This is a test paragraph with enough content to meet the minimum length requirement.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
    };

    const paragraph = await Paragraph.create(paragraphData);
    expect(paragraph.isActive).toBe(true);
  });
});

describe("TranslationCache Model", () => {
  it("should create a valid translation cache entry", async () => {
    const cacheData = {
      text: "Hello",
      sourceLang: Language.ENGLISH,
      targetLang: Language.SPANISH,
      translation: "Hola",
      provider: "openai",
    };

    const cache = await TranslationCache.create(cacheData);
    expect(cache._id).toBeDefined();
    expect(cache.translation).toBe(cacheData.translation);
    expect(cache.expiresAt).toBeDefined();
  });

  it("should enforce compound unique index", async () => {
    const cacheData = {
      text: "Hello",
      sourceLang: Language.ENGLISH,
      targetLang: Language.SPANISH,
      translation: "Hola",
    };

    await TranslationCache.create(cacheData);
    await expect(TranslationCache.create(cacheData)).rejects.toThrow();
  });

  it("should allow same text with different language pairs", async () => {
    const cache1 = await TranslationCache.create({
      text: "Hello",
      sourceLang: Language.ENGLISH,
      targetLang: Language.SPANISH,
      translation: "Hola",
    });

    const cache2 = await TranslationCache.create({
      text: "Hello",
      sourceLang: Language.ENGLISH,
      targetLang: Language.FRENCH,
      translation: "Bonjour",
    });

    expect(cache1._id).not.toEqual(cache2._id);
  });

  it("should set default expiration date", async () => {
    const cacheData = {
      text: "Hello",
      sourceLang: Language.ENGLISH,
      targetLang: Language.SPANISH,
      translation: "Hola",
    };

    const cache = await TranslationCache.create(cacheData);
    expect(cache.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("ExerciseAttempt Model", () => {
  it("should create a valid exercise attempt", async () => {
    const attemptData = {
      userId: new mongoose.Types.ObjectId().toString(),
      paragraphId: new mongoose.Types.ObjectId().toString(),
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "This is my translation",
      correctAnswer: "This is the correct translation",
      score: 85,
    };

    const attempt = await ExerciseAttempt.create(attemptData);
    expect(attempt._id).toBeDefined();
    expect(attempt.score).toBe(attemptData.score);
    expect(attempt.completedAt).toBeDefined();
  });

  it("should enforce score range", async () => {
    const attemptData = {
      userId: new mongoose.Types.ObjectId().toString(),
      paragraphId: new mongoose.Types.ObjectId().toString(),
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "This is my translation",
      score: 150,
    };

    await expect(ExerciseAttempt.create(attemptData)).rejects.toThrow();
  });

  it("should enforce minimum score", async () => {
    const attemptData = {
      userId: new mongoose.Types.ObjectId().toString(),
      paragraphId: new mongoose.Types.ObjectId().toString(),
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "This is my translation",
      score: -10,
    };

    await expect(ExerciseAttempt.create(attemptData)).rejects.toThrow();
  });

  it("should default completedAt to current time", async () => {
    const attemptData = {
      userId: new mongoose.Types.ObjectId().toString(),
      paragraphId: new mongoose.Types.ObjectId().toString(),
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "This is my translation",
      score: 85,
    };

    const before = new Date();
    const attempt = await ExerciseAttempt.create(attemptData);
    const after = new Date();

    expect(attempt.completedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(attempt.completedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should store AI analysis", async () => {
    const attemptData = {
      userId: new mongoose.Types.ObjectId().toString(),
      paragraphId: new mongoose.Types.ObjectId().toString(),
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "This is my translation",
      score: 85,
      aiAnalysis: {
        strengths: ["Good grammar", "Clear meaning"],
        improvements: ["Vocabulary could be richer"],
        suggestions: ["Try using synonyms"],
      },
    };

    const attempt = await ExerciseAttempt.create(attemptData);
    expect(attempt.aiAnalysis?.strengths).toHaveLength(2);
    expect(attempt.aiAnalysis?.improvements).toHaveLength(1);
  });
});

describe("AdminUser Model", () => {
  it("should create a valid admin user", async () => {
    const adminData = {
      userId: new mongoose.Types.ObjectId().toString(),
      role: AdminRole.ADMIN,
      permissions: ["manage_users", "view_analytics"],
    };

    const admin = await AdminUser.create(adminData);
    expect(admin._id).toBeDefined();
    expect(admin.role).toBe(adminData.role);
    expect(admin.isActive).toBe(true);
  });

  it("should enforce unique userId", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const adminData = {
      userId,
      role: AdminRole.ADMIN,
    };

    await AdminUser.create(adminData);
    await expect(AdminUser.create(adminData)).rejects.toThrow();
  });

  it("should enforce enum values for role", async () => {
    const adminData = {
      userId: new mongoose.Types.ObjectId().toString(),
      role: "invalid-role",
    };

    await expect(AdminUser.create(adminData)).rejects.toThrow();
  });

  it("should limit permissions to 50", async () => {
    const adminData = {
      userId: new mongoose.Types.ObjectId().toString(),
      role: AdminRole.ADMIN,
      permissions: Array(51).fill("permission"),
    };

    await expect(AdminUser.create(adminData)).rejects.toThrow();
  });

  it("should default role to MODERATOR", async () => {
    const adminData = {
      userId: new mongoose.Types.ObjectId().toString(),
    };

    const admin = await AdminUser.create(adminData);
    expect(admin.role).toBe(AdminRole.MODERATOR);
  });

  it("should enforce maximum notes length", async () => {
    const adminData = {
      userId: new mongoose.Types.ObjectId().toString(),
      role: AdminRole.ADMIN,
      notes: "a".repeat(1001),
    };

    await expect(AdminUser.create(adminData)).rejects.toThrow();
  });
});
