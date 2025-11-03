/**
 * @jest-environment node
 */

import { POST as generatePdfPost } from "@/app/api/pdf/generate/route";
import { GET as downloadPdfGet } from "@/app/api/pdf/download/route";
import { NextRequest } from "next/server";

// Mock dependencies
jest.mock("@/lib/pdf/generator", () => ({
  generateOrUpdateUserPdf: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/lib/aws/s3", () => ({
  generateSignedUrl: jest.fn(),
  getUserPdfKey: jest.fn((userId: string) => `pdfs/${userId}/learning-textbook.pdf`),
  isAwsConfigured: jest.fn(() => true),
}));

jest.mock("@/lib/db/mongoose", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/models/User", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

describe("PDF API Routes", () => {
  describe("POST /api/pdf/generate", () => {
    it("should validate required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/pdf/generate", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await generatePdfPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("userId and attemptId are required");
    });

    it("should validate ObjectId format", async () => {
      const request = new NextRequest("http://localhost:3000/api/pdf/generate", {
        method: "POST",
        body: JSON.stringify({
          userId: "invalid-id",
          attemptId: "invalid-id",
        }),
      });

      const response = await generatePdfPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid userId or attemptId format");
    });

    it("should call generateOrUpdateUserPdf with valid data", async () => {
      const { generateOrUpdateUserPdf } = await import("@/lib/pdf/generator");
      (generateOrUpdateUserPdf as jest.Mock).mockResolvedValue({ success: true });

      const request = new NextRequest("http://localhost:3000/api/pdf/generate", {
        method: "POST",
        body: JSON.stringify({
          userId: "507f1f77bcf86cd799439011",
          attemptId: "507f1f77bcf86cd799439012",
        }),
      });

      const response = await generatePdfPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(generateOrUpdateUserPdf).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012"
      );
    });

    it("should handle generation errors", async () => {
      const { generateOrUpdateUserPdf } = await import("@/lib/pdf/generator");
      (generateOrUpdateUserPdf as jest.Mock).mockResolvedValue({
        success: false,
        error: "PDF generation failed",
      });

      const request = new NextRequest("http://localhost:3000/api/pdf/generate", {
        method: "POST",
        body: JSON.stringify({
          userId: "507f1f77bcf86cd799439011",
          attemptId: "507f1f77bcf86cd799439012",
        }),
      });

      const response = await generatePdfPost(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("PDF generation failed");
    });
  });

  describe("GET /api/pdf/download", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should require authentication", async () => {
      const { getCurrentUser } = await import("@/lib/auth");
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/pdf/download");
      const response = await downloadPdfGet(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should require active subscription", async () => {
      const { getCurrentUser } = await import("@/lib/auth");
      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        subscriptionStatus: "canceled",
      });

      const request = new NextRequest("http://localhost:3000/api/pdf/download");
      const response = await downloadPdfGet(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Active subscription required");
    });

    it("should return error if no PDF exists", async () => {
      const { getCurrentUser } = await import("@/lib/auth");
      const User = (await import("@/lib/models/User")).default;

      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        subscriptionStatus: "active",
      });

      (User.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: "507f1f77bcf86cd799439011",
          pdfUrl: null,
          pdfLessonsCount: 0,
        }),
      });

      const request = new NextRequest("http://localhost:3000/api/pdf/download");
      const response = await downloadPdfGet(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain("No PDF available yet");
    });

    it("should generate signed URL successfully", async () => {
      const { getCurrentUser } = await import("@/lib/auth");
      const { generateSignedUrl } = await import("@/lib/aws/s3");
      const User = (await import("@/lib/models/User")).default;

      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        subscriptionStatus: "active",
      });

      (User.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: "507f1f77bcf86cd799439011",
          pdfUrl: "https://example.com/pdf.pdf",
          pdfLessonsCount: 5,
          pdfLastUpdated: new Date("2024-01-15"),
        }),
      });

      (generateSignedUrl as jest.Mock).mockResolvedValue({
        success: true,
        url: "https://signed-url.example.com",
      });

      const request = new NextRequest("http://localhost:3000/api/pdf/download");
      const response = await downloadPdfGet(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.url).toBe("https://signed-url.example.com");
      expect(data.lessonsCount).toBe(5);
      expect(data.expiresIn).toBe(3600);
    });

    it("should handle signed URL generation errors", async () => {
      const { getCurrentUser } = await import("@/lib/auth");
      const { generateSignedUrl } = await import("@/lib/aws/s3");
      const User = (await import("@/lib/models/User")).default;

      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        subscriptionStatus: "active",
      });

      (User.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: "507f1f77bcf86cd799439011",
          pdfUrl: "https://example.com/pdf.pdf",
          pdfLessonsCount: 5,
        }),
      });

      (generateSignedUrl as jest.Mock).mockResolvedValue({
        success: false,
        error: "S3 error",
      });

      const request = new NextRequest("http://localhost:3000/api/pdf/download");
      const response = await downloadPdfGet(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to generate download URL");
    });
  });
});
