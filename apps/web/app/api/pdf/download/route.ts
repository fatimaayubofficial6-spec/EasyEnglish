import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateSignedUrl, getUserPdfKey, isAwsConfigured } from "@/lib/aws/s3";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { SubscriptionStatus } from "@/types/models";

/**
 * API route to generate a signed download URL for user's PDF textbook
 * Requires authentication and active subscription
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription status
    if (user.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      );
    }

    if (!isAwsConfigured()) {
      return NextResponse.json(
        { error: "PDF download service not configured" },
        { status: 503 }
      );
    }

    await connectDB();

    // Fetch user data to check if PDF exists
    const userData = await User.findById(user.id).lean();

    if (!userData || !userData.pdfUrl || !userData.pdfLessonsCount) {
      return NextResponse.json(
        { error: "No PDF available yet. Complete some exercises to generate your textbook!" },
        { status: 404 }
      );
    }

    // Generate signed URL (expires in 1 hour)
    const pdfKey = getUserPdfKey(user.id);
    const signedUrlResult = await generateSignedUrl(pdfKey, 3600);

    if (!signedUrlResult.success) {
      console.error(`Failed to generate signed URL: ${signedUrlResult.error}`);
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: signedUrlResult.url,
      expiresIn: 3600,
      lessonsCount: userData.pdfLessonsCount,
      lastUpdated: userData.pdfLastUpdated,
    });
  } catch (error) {
    console.error("Error generating PDF download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
