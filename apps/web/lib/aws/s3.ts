import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS S3 Configuration
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

// Check if AWS is configured
export function isAwsConfigured(): boolean {
  return !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_S3_BUCKET);
}

// Initialize S3 client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!isAwsConfigured()) {
    throw new Error("AWS credentials not configured");
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return s3Client;
}

/**
 * Upload a PDF file to S3
 */
export async function uploadPdfToS3(
  key: string,
  pdfBuffer: Buffer,
  contentType: string = "application/pdf"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!isAwsConfigured()) {
      console.warn("AWS not configured - PDF upload skipped");
      return {
        success: false,
        error: "AWS credentials not configured",
      };
    }

    const client = getS3Client();

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET!,
      Key: key,
      Body: pdfBuffer,
      ContentType: contentType,
      // Private ACL - users must use signed URLs to download
      ACL: "private",
    });

    await client.send(command);

    const url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    console.log(`Successfully uploaded PDF to S3: ${key}`);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Failed to upload PDF to S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Download a PDF file from S3
 */
export async function downloadPdfFromS3(
  key: string
): Promise<{ success: boolean; buffer?: Buffer; error?: string }> {
  try {
    if (!isAwsConfigured()) {
      console.warn("AWS not configured - PDF download skipped");
      return {
        success: false,
        error: "AWS credentials not configured",
      };
    }

    const client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET!,
      Key: key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return {
        success: false,
        error: "No data received from S3",
      };
    }

    // Convert stream to buffer
    const buffer = await streamToBuffer(response.Body);

    console.log(`Successfully downloaded PDF from S3: ${key}`);

    return {
      success: true,
      buffer,
    };
  } catch (error) {
    console.error("Failed to download PDF from S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate a signed URL for secure PDF download
 * URL expires after the specified time (default: 1 hour)
 */
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!isAwsConfigured()) {
      console.warn("AWS not configured - signed URL generation skipped");
      return {
        success: false,
        error: "AWS credentials not configured",
      };
    }

    const client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET!,
      Key: key,
    });

    const url = await getSignedUrl(client, command, { expiresIn });

    console.log(`Generated signed URL for: ${key} (expires in ${expiresIn}s)`);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Helper function to convert stream to buffer
 */
async function streamToBuffer(stream: unknown): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const chunk of stream as any) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks);
}

/**
 * Get the S3 key for a user's PDF textbook
 */
export function getUserPdfKey(userId: string): string {
  return `pdfs/${userId}/learning-textbook.pdf`;
}
