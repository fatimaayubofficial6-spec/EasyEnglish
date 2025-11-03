import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "@/lib/models/User";
import { SubscriptionStatus, SubscriptionTier, Language } from "@/types/models";
import { PATCH } from "@/app/api/user/language/route";
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth/config", () => ({
  authOptions: {},
}));

jest.mock("@/lib/db/mongoose", () => jest.fn().mockResolvedValue(undefined));

import { getServerSession } from "next-auth";
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe("Language API Route", () => {
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
    jest.clearAllMocks();
  });

  describe("PATCH /api/user/language", () => {
    it("should require authentication", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "es",
          nativeLanguageName: "Spanish",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should require nativeLanguage field", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguageName: "Spanish",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Native language code is required");
    });

    it("should require nativeLanguageName field", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "es",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Native language name is required");
    });

    it("should validate language code", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "invalid-code",
          nativeLanguageName: "Invalid Language",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid language code");
    });

    it("should update user language successfully", async () => {
      const testUser = await User.create({
        email: "test@example.com",
        name: "Test User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: false,
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "es",
          nativeLanguageName: "Spanish",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.nativeLanguage).toBe("es");
      expect(data.user.nativeLanguageName).toBe("Spanish");
      expect(data.user.onboardingCompleted).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser?.nativeLanguage).toBe("es");
      expect(updatedUser?.nativeLanguageName).toBe("Spanish");
      expect(updatedUser?.onboardingCompleted).toBe(true);
    });

    it("should handle user not found", async () => {
      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "nonexistent@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "es",
          nativeLanguageName: "Spanish",
        }),
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should accept all valid language codes from the dataset", async () => {
      const testUser = await User.create({
        email: "test@example.com",
        name: "Test User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: false,
      });

      const validLanguageCodes = ["en", "es", "fr", "de", "ja", "zh", "ar", "hi", "pt", "ru"];

      for (const code of validLanguageCodes) {
        mockGetServerSession.mockResolvedValueOnce({
          user: { email: "test@example.com" },
        } as any);

        const req = new NextRequest("http://localhost:3000/api/user/language", {
          method: "PATCH",
          body: JSON.stringify({
            nativeLanguage: code,
            nativeLanguageName: "Test Language",
          }),
        });

        const response = await PATCH(req);
        expect(response.status).toBe(200);
      }
    });

    it("should update onboardingCompleted flag", async () => {
      const testUser = await User.create({
        email: "test@example.com",
        name: "Test User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: false,
      });

      expect(testUser.onboardingCompleted).toBe(false);

      mockGetServerSession.mockResolvedValueOnce({
        user: { email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/user/language", {
        method: "PATCH",
        body: JSON.stringify({
          nativeLanguage: "es",
          nativeLanguageName: "Spanish",
        }),
      });

      await PATCH(req);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser?.onboardingCompleted).toBe(true);
    });
  });
});
