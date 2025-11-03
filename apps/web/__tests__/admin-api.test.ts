/**
 * @jest-environment node
 */

import { POST as loginPost } from "@/app/api/admin/auth/login/route";
import { POST as logoutPost } from "@/app/api/admin/auth/logout/route";
import { GET as paragraphsGet, POST as paragraphsPost } from "@/app/api/admin/paragraphs/route";
import { GET as subscribersGet } from "@/app/api/admin/subscribers/route";
import connectDB from "@/lib/db/mongoose";
import AdminUser from "@/lib/models/AdminUser";
import Paragraph from "@/lib/models/Paragraph";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/admin";
import { DifficultyLevel, AdminRole, Language } from "@/types/models";

jest.mock("@/lib/auth/admin", () => ({
  ...jest.requireActual("@/lib/auth/admin"),
  requireAdminAuth: jest.fn().mockResolvedValue({ adminId: "test-admin-id", email: "admin@test.com", role: "super_admin" }),
}));

describe("Admin API Routes", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await AdminUser.deleteMany({});
    await Paragraph.deleteMany({});
    await User.deleteMany({});
  });

  describe("POST /api/admin/auth/login", () => {
    it("should login with valid credentials", async () => {
      const hashedPwd = await hashPassword("test123");
      await AdminUser.create({
        email: "admin@test.com",
        hashedPassword: hashedPwd,
        name: "Test Admin",
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      });

      const request = new Request("http://localhost/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@test.com", password: "test123" }),
      });

      const response = await loginPost(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.admin.email).toBe("admin@test.com");
    });

    it("should reject invalid credentials", async () => {
      const hashedPwd = await hashPassword("test123");
      await AdminUser.create({
        email: "admin@test.com",
        hashedPassword: hashedPwd,
        name: "Test Admin",
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      });

      const request = new Request("http://localhost/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@test.com", password: "wrong" }),
      });

      const response = await loginPost(request as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBeDefined();
    });

    it("should reject missing credentials", async () => {
      const request = new Request("http://localhost/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@test.com" }),
      });

      const response = await loginPost(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe("POST /api/admin/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await logoutPost();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("GET /api/admin/paragraphs", () => {
    it("should list paragraphs with pagination", async () => {
      await Paragraph.create({
        title: "Test Paragraph",
        content: "This is a test paragraph with enough content to meet the minimum requirement.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
      });

      const request = new Request("http://localhost/api/admin/paragraphs?page=1&limit=10");

      const response = await paragraphsGet(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.paragraphs).toBeDefined();
      expect(data.paragraphs.length).toBe(1);
      expect(data.pagination).toBeDefined();
    });

    it("should filter paragraphs by difficulty", async () => {
      await Paragraph.create({
        title: "Beginner Paragraph",
        content: "This is a beginner test paragraph with enough content to meet the requirement.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
      });

      await Paragraph.create({
        title: "Advanced Paragraph",
        content: "This is an advanced test paragraph with enough content to meet the requirement.",
        difficulty: DifficultyLevel.ADVANCED,
        language: Language.ENGLISH,
      });

      const request = new Request("http://localhost/api/admin/paragraphs?difficulty=beginner");

      const response = await paragraphsGet(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.paragraphs.length).toBe(1);
      expect(data.paragraphs[0].difficulty).toBe(DifficultyLevel.BEGINNER);
    });
  });

  describe("POST /api/admin/paragraphs", () => {
    it("should create a paragraph", async () => {
      const request = new Request("http://localhost/api/admin/paragraphs", {
        method: "POST",
        body: JSON.stringify({
          title: "New Paragraph",
          content: "This is a new test paragraph with enough content to meet the minimum requirement.",
          difficulty: DifficultyLevel.INTERMEDIATE,
          topics: ["test", "technology"],
        }),
      });

      const response = await paragraphsPost(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.paragraph).toBeDefined();
      expect(data.paragraph.title).toBe("New Paragraph");
      expect(data.paragraph.difficulty).toBe(DifficultyLevel.INTERMEDIATE);
    });

    it("should reject invalid paragraph data", async () => {
      const request = new Request("http://localhost/api/admin/paragraphs", {
        method: "POST",
        body: JSON.stringify({
          title: "Test",
        }),
      });

      const response = await paragraphsPost(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe("GET /api/admin/subscribers", () => {
    it("should list subscribers with pagination", async () => {
      await User.create({
        email: "user@test.com",
        name: "Test User",
        subscriptionStatus: "active",
        subscriptionTier: "premium",
        learningLanguage: Language.ENGLISH,
        onboardingCompleted: true,
      });

      const request = new Request("http://localhost/api/admin/subscribers?page=1&limit=20");

      const response = await subscribersGet(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toBeDefined();
      expect(data.users.length).toBe(1);
      expect(data.pagination).toBeDefined();
    });

    it("should filter subscribers by status", async () => {
      await User.create({
        email: "active@test.com",
        subscriptionStatus: "active",
        subscriptionTier: "premium",
        learningLanguage: Language.ENGLISH,
        onboardingCompleted: true,
      });

      await User.create({
        email: "canceled@test.com",
        subscriptionStatus: "canceled",
        subscriptionTier: "free",
        learningLanguage: Language.ENGLISH,
        onboardingCompleted: true,
      });

      const request = new Request("http://localhost/api/admin/subscribers?status=active");

      const response = await subscribersGet(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users.length).toBe(1);
      expect(data.users[0].subscriptionStatus).toBe("active");
    });
  });
});
