import { NextRequest, NextResponse } from "next/server";
import { generateOrUpdateUserPdf } from "@/lib/pdf/generator";

interface GeneratePdfBody {
  userId: string;
  attemptId: string;
}

/**
 * API route to trigger PDF generation/update
 * This is called as a background job after exercise submission
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: GeneratePdfBody;
    try {
      body = await request.json();
    } catch (_error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { userId, attemptId } = body;

    // Validate required fields
    if (!userId || !attemptId) {
      return NextResponse.json(
        { error: "userId and attemptId are required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId) || !/^[0-9a-fA-F]{24}$/.test(attemptId)) {
      return NextResponse.json(
        { error: "Invalid userId or attemptId format" },
        { status: 400 }
      );
    }

    console.log(`PDF generation requested for user ${userId}, attempt ${attemptId}`);

    // Generate/update PDF
    const result = await generateOrUpdateUserPdf(userId, attemptId);

    if (!result.success) {
      console.error(`PDF generation failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error || "PDF generation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PDF generated/updated successfully",
    });
  } catch (error) {
    console.error("Error in PDF generation API:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
