/**
 * @jest-environment node
 */

import { uploadPdfToS3, downloadPdfFromS3, generateSignedUrl, getUserPdfKey } from "@/lib/aws/s3";

// Mock AWS SDK
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

describe("S3 Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getUserPdfKey", () => {
    it("should generate correct S3 key for user", () => {
      const userId = "123456789012345678901234";
      const key = getUserPdfKey(userId);
      expect(key).toBe("pdfs/123456789012345678901234/learning-textbook.pdf");
    });
  });

  describe("uploadPdfToS3", () => {
    it("should return error if AWS not configured", async () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_S3_BUCKET;

      const { uploadPdfToS3: upload } = await import("@/lib/aws/s3");

      const result = await upload("test-key", Buffer.from("test"));

      expect(result.success).toBe(false);
      expect(result.error).toBe("AWS credentials not configured");
    });

    it("should upload PDF successfully when configured", async () => {
      process.env.AWS_ACCESS_KEY_ID = "test-key-id";
      process.env.AWS_SECRET_ACCESS_KEY = "test-secret";
      process.env.AWS_S3_BUCKET = "test-bucket";
      process.env.AWS_REGION = "us-east-1";

      const mockSend = jest.fn().mockResolvedValue({});
      const { S3Client } = await import("@aws-sdk/client-s3");
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));

      const { uploadPdfToS3: upload } = await import("@/lib/aws/s3");

      const result = await upload("test-key", Buffer.from("test"));

      expect(result.success).toBe(true);
      expect(result.url).toBe("https://test-bucket.s3.us-east-1.amazonaws.com/test-key");
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe("downloadPdfFromS3", () => {
    it("should return error if AWS not configured", async () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_S3_BUCKET;

      const { downloadPdfFromS3: download } = await import("@/lib/aws/s3");

      const result = await download("test-key");

      expect(result.success).toBe(false);
      expect(result.error).toBe("AWS credentials not configured");
    });
  });

  describe("generateSignedUrl", () => {
    it("should return error if AWS not configured", async () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_S3_BUCKET;

      const { generateSignedUrl: genUrl } = await import("@/lib/aws/s3");

      const result = await genUrl("test-key");

      expect(result.success).toBe(false);
      expect(result.error).toBe("AWS credentials not configured");
    });

    it("should generate signed URL successfully when configured", async () => {
      process.env.AWS_ACCESS_KEY_ID = "test-key-id";
      process.env.AWS_SECRET_ACCESS_KEY = "test-secret";
      process.env.AWS_S3_BUCKET = "test-bucket";
      process.env.AWS_REGION = "us-east-1";

      const mockGetSignedUrl = jest.fn().mockResolvedValue("https://signed-url.example.com");
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      (getSignedUrl as jest.Mock).mockImplementation(mockGetSignedUrl);

      const { generateSignedUrl: genUrl } = await import("@/lib/aws/s3");

      const result = await genUrl("test-key", 3600);

      expect(result.success).toBe(true);
      expect(result.url).toBe("https://signed-url.example.com");
    });
  });
});
