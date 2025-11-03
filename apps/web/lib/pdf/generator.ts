import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { generateLessonHtml, PdfLessonData } from "@/templates/pdfLesson";
import { uploadPdfToS3, downloadPdfFromS3, getUserPdfKey, isAwsConfigured } from "@/lib/aws/s3";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import Paragraph from "@/lib/models/Paragraph";

/**
 * Generate a new lesson PDF from HTML
 */
async function generateLessonPdf(lessonData: PdfLessonData): Promise<Buffer> {
  const html = generateLessonHtml(lessonData);

  // Launch Puppeteer in headless mode (compatible with serverless)
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set content and wait for fonts/styles to load
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * Merge two PDFs together
 */
async function mergePdfs(existingPdfBuffer: Buffer, newLessonBuffer: Buffer): Promise<Buffer> {
  const existingPdf = await PDFDocument.load(existingPdfBuffer);
  const newLessonPdf = await PDFDocument.load(newLessonBuffer);

  const mergedPdf = await PDFDocument.create();

  // Copy all pages from existing PDF
  const existingPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
  existingPages.forEach((page) => mergedPdf.addPage(page));

  // Copy all pages from new lesson PDF
  const newPages = await mergedPdf.copyPages(newLessonPdf, newLessonPdf.getPageIndices());
  newPages.forEach((page) => mergedPdf.addPage(page));

  const mergedPdfBytes = await mergedPdf.save();
  return Buffer.from(mergedPdfBytes);
}

/**
 * Main service function: Generate or update user's PDF textbook
 * Fetches existing PDF from S3, renders new lesson, merges, and uploads
 */
export async function generateOrUpdateUserPdf(
  userId: string,
  attemptId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAwsConfigured()) {
      console.warn("AWS not configured - PDF generation skipped");
      return {
        success: false,
        error: "AWS credentials not configured",
      };
    }

    await connectDB();

    // Fetch exercise attempt with populated data
    const attempt = await ExerciseAttempt.findById(attemptId).lean();
    if (!attempt) {
      return {
        success: false,
        error: "Exercise attempt not found",
      };
    }

    // Check if already added to PDF
    if (attempt.addedToPdf) {
      console.log(`Attempt ${attemptId} already added to PDF, skipping`);
      return { success: true };
    }

    // Fetch paragraph data
    const paragraph = await Paragraph.findById(attempt.paragraphId).lean();
    if (!paragraph) {
      return {
        success: false,
        error: "Paragraph not found",
      };
    }

    // Fetch user data
    const user = await User.findById(userId).lean();
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Calculate lesson number (current count + 1)
    const lessonNumber = (user.pdfLessonsCount || 0) + 1;

    // Prepare lesson data
    const lessonData: PdfLessonData = {
      lessonNumber,
      title: paragraph.title,
      originalText: paragraph.content,
      userTranslation: attempt.userAnswer,
      correctedVersion: attempt.aiAnalysis?.correctedVersion,
      score: attempt.score,
      completedAt: attempt.completedAt,
      difficulty: paragraph.difficulty,
      topics: paragraph.topics,
      grammarMistakes: attempt.aiAnalysis?.grammarMistakes,
      keyVocabulary: attempt.aiAnalysis?.keyVocabulary,
      tenses: attempt.aiAnalysis?.tenses,
      strengths: attempt.aiAnalysis?.strengths,
      improvements: attempt.aiAnalysis?.improvements,
      suggestions: attempt.aiAnalysis?.suggestions,
    };

    console.log(`Generating PDF lesson ${lessonNumber} for user ${userId}...`);

    // Generate new lesson PDF
    const newLessonBuffer = await generateLessonPdf(lessonData);

    let finalPdfBuffer: Buffer;

    // Try to fetch existing PDF from S3
    const pdfKey = getUserPdfKey(userId);
    const existingPdfResult = await downloadPdfFromS3(pdfKey);

    if (existingPdfResult.success && existingPdfResult.buffer) {
      console.log(`Merging with existing PDF for user ${userId}...`);
      // Merge with existing PDF
      finalPdfBuffer = await mergePdfs(existingPdfResult.buffer, newLessonBuffer);
    } else {
      console.log(`No existing PDF found, creating new PDF for user ${userId}...`);
      // First lesson - just use the new lesson PDF
      finalPdfBuffer = newLessonBuffer;
    }

    // Upload merged PDF to S3
    const uploadResult = await uploadPdfToS3(pdfKey, finalPdfBuffer);

    if (!uploadResult.success) {
      return {
        success: false,
        error: `Failed to upload PDF: ${uploadResult.error}`,
      };
    }

    // Update user document
    await User.findByIdAndUpdate(userId, {
      pdfUrl: uploadResult.url,
      pdfLessonsCount: lessonNumber,
      pdfLastUpdated: new Date(),
    });

    // Mark attempt as added to PDF
    await ExerciseAttempt.findByIdAndUpdate(attemptId, {
      addedToPdf: true,
    });

    console.log(`Successfully generated PDF for user ${userId} (lesson ${lessonNumber})`);

    return { success: true };
  } catch (error) {
    console.error("Error generating/updating user PDF:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if Puppeteer is available
 * Used for graceful degradation
 */
export function isPuppeteerAvailable(): boolean {
  try {
    // Check if puppeteer module can be imported
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("puppeteer");
    return true;
  } catch {
    return false;
  }
}
