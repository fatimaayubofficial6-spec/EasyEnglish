/**
 * @jest-environment node
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Paragraph, TranslationCache, ExerciseAttempt, User } from "../lib/models";
import {
  DifficultyLevel,
  Language,
  ExerciseType,
  SubscriptionTier,
  SubscriptionStatus,
} from "../types/models";

// Mock the Gemini AI client
jest.mock("../lib/ai/gemini", () => ({
  isGeminiConfigured: jest.fn(() => true),
  translateText: jest.fn().mockResolvedValue({
    success: true,
    translation: "Hola, esto es una traducción de prueba.",
  }),
  generateFeedback: jest.fn().mockResolvedValue({
    success: true,
    feedback: {
      score: 85,
      strengths: ["Good grammar", "Clear meaning"],
      improvements: ["Could use more advanced vocabulary"],
      suggestions: ["Try using synonyms"],
      overallFeedback: "Good translation overall.",
    },
  }),
}));

// Mock getCurrentUser
jest.mock("../lib/auth", () => ({
  getCurrentUser: jest.fn(),
}));

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
  jest.clearAllMocks();
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Exercise API - GET /api/exercises/[id]", () => {
  let testParagraph: any;
  let testUser: any;

  beforeEach(async () => {
    // Create test data
    testParagraph = await Paragraph.create({
      title: "Test Paragraph",
      content: "This is a test paragraph with enough content for testing purposes.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
      topics: ["test"],
      isActive: true,
    });

    testUser = await User.create({
      email: "test@example.com",
      name: "Test User",
      nativeLanguage: "es",
      nativeLanguageName: "Spanish",
      learningLanguage: Language.ENGLISH,
      subscriptionTier: SubscriptionTier.PREMIUM,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      onboardingCompleted: true,
    });
  });

  it("should return paragraph with translation (cache miss)", async () => {
    const { getCurrentUser } = require("../lib/auth");
    const { translateText } = require("../lib/ai/gemini");

    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      nativeLanguage: testUser.nativeLanguage,
      nativeLanguageName: testUser.nativeLanguageName,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    // Dynamically import the route handler
    const { GET } = await import("../app/api/exercises/[id]/route");
    const request = new Request("http://localhost:3000/api/exercises/" + testParagraph._id.toString());
    const params = { id: testParagraph._id.toString() };

    const response = await GET(request as any, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe(testParagraph._id.toString());
    expect(data.content).toBe(testParagraph.content);
    expect(data.translation).toBeDefined();
    expect(data.translationLanguage).toBe("es");
    expect(translateText).toHaveBeenCalledTimes(1);

    // Verify translation was cached
    const cached = await TranslationCache.findOne({
      text: testParagraph.content,
      sourceLang: Language.ENGLISH,
      targetLang: "es",
    });
    expect(cached).toBeDefined();
    expect(cached?.translation).toBe("Hola, esto es una traducción de prueba.");
  });

  it("should return paragraph with translation (cache hit)", async () => {
    const { getCurrentUser } = require("../lib/auth");
    const { translateText } = require("../lib/ai/gemini");

    // Create cached translation first
    await TranslationCache.create({
      text: testParagraph.content,
      sourceLang: Language.ENGLISH,
      targetLang: "es" as Language,
      translation: "Cached translation",
      provider: "gemini",
    });

    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      nativeLanguage: testUser.nativeLanguage,
      nativeLanguageName: testUser.nativeLanguageName,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const { GET } = await import("../app/api/exercises/[id]/route");
    const request = new Request("http://localhost:3000/api/exercises/" + testParagraph._id.toString());
    const params = { id: testParagraph._id.toString() };

    const response = await GET(request as any, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.translation).toBe("Cached translation");
    expect(translateText).not.toHaveBeenCalled(); // Should not call API
  });

  it("should return 401 if user not authenticated", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue(null);

    const { GET } = await import("../app/api/exercises/[id]/route");
    const request = new Request("http://localhost:3000/api/exercises/" + testParagraph._id.toString());
    const params = { id: testParagraph._id.toString() };

    const response = await GET(request as any, { params });
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid exercise ID", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const { GET } = await import("../app/api/exercises/[id]/route");
    const request = new Request("http://localhost:3000/api/exercises/invalid-id");
    const params = { id: "invalid-id" };

    const response = await GET(request as any, { params });
    expect(response.status).toBe(400);
  });

  it("should return 404 for non-existent exercise", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const { GET } = await import("../app/api/exercises/[id]/route");
    const request = new Request("http://localhost:3000/api/exercises/" + nonExistentId);
    const params = { id: nonExistentId };

    const response = await GET(request as any, { params });
    expect(response.status).toBe(404);
  });
});

describe("Exercise API - POST /api/exercises/[id]/submit", () => {
  let testParagraph: any;
  let testUser: any;

  beforeEach(async () => {
    testParagraph = await Paragraph.create({
      title: "Test Paragraph",
      content: "This is a test paragraph with enough content for testing purposes.",
      difficulty: DifficultyLevel.BEGINNER,
      language: Language.ENGLISH,
      topics: ["test"],
      isActive: true,
    });

    testUser = await User.create({
      email: "test@example.com",
      name: "Test User",
      learningLanguage: Language.ENGLISH,
      subscriptionTier: SubscriptionTier.PREMIUM,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      onboardingCompleted: true,
    });
  });

  it("should successfully submit exercise and return feedback", async () => {
    const { getCurrentUser } = require("../lib/auth");
    const { generateFeedback } = require("../lib/ai/gemini");

    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const requestBody = {
      exerciseType: ExerciseType.TRANSLATION,
      userAnswer: "Esta es mi traducción",
      correctAnswer: "Esta es la traducción correcta",
      timeSpentSeconds: 120,
    };

    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.attemptId).toBeDefined();
    expect(data.score).toBe(85);
    expect(data.feedback).toBeDefined();
    expect(data.aiAnalysis).toBeDefined();
    expect(data.aiAnalysis.strengths).toHaveLength(2);
    expect(data.completed).toBe(true); // Score >= 70
    expect(generateFeedback).toHaveBeenCalledTimes(1);

    // Verify exercise attempt was stored
    const attempt = await ExerciseAttempt.findOne({
      userId: testUser._id.toString(),
      paragraphId: testParagraph._id.toString(),
    });
    expect(attempt).toBeDefined();
    expect(attempt?.score).toBe(85);
    expect(attempt?.userAnswer).toBe(requestBody.userAnswer);

    // Verify user stats were updated
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser?.lastExerciseDate).toBeDefined();
  });

  it("should return 401 if user not authenticated", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue(null);

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Test",
        }),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    expect(response.status).toBe(401);
  });

  it("should return 403 if subscription not active", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: SubscriptionStatus.EXPIRED,
    });

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Test",
        }),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    expect(response.status).toBe(403);
  });

  it("should return 400 for invalid request body", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          // Missing required fields
        }),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    expect(response.status).toBe(400);
  });

  it("should handle empty user answer", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "   ",
        }),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    expect(response.status).toBe(400);
  });

  it("should handle AI feedback failure gracefully", async () => {
    const { getCurrentUser } = require("../lib/auth");
    const { generateFeedback } = require("../lib/ai/gemini");

    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    generateFeedback.mockResolvedValueOnce({
      success: false,
      error: "API Error",
    });

    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + testParagraph._id.toString() + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Esta es mi traducción",
        }),
      }
    );
    const params = { id: testParagraph._id.toString() };

    const response = await POST(request as any, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.score).toBe(50); // Fallback score
    expect(data.feedback).toContain("Unable to generate detailed feedback");

    // Verify attempt was still stored
    const attempt = await ExerciseAttempt.findOne({
      userId: testUser._id.toString(),
    });
    expect(attempt).toBeDefined();
  });

  it("should return 404 for non-existent exercise", async () => {
    const { getCurrentUser } = require("../lib/auth");
    getCurrentUser.mockResolvedValue({
      id: testUser._id.toString(),
      email: testUser.email,
      subscriptionStatus: testUser.subscriptionStatus,
    });

    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const { POST } = await import("../app/api/exercises/[id]/submit/route");
    
    const request = new Request(
      "http://localhost:3000/api/exercises/" + nonExistentId + "/submit",
      {
        method: "POST",
        body: JSON.stringify({
          exerciseType: ExerciseType.TRANSLATION,
          userAnswer: "Test",
        }),
      }
    );
    const params = { id: nonExistentId };

    const response = await POST(request as any, { params });
    expect(response.status).toBe(404);
  });
});
