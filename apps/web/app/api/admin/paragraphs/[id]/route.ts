import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import connectDB from "@/lib/db/mongoose";
import Paragraph from "@/lib/models/Paragraph";
import { DifficultyLevel, Language } from "@/types/models";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminAuth();
    await connectDB();

    const paragraph = await Paragraph.findById(params.id).lean();

    if (!paragraph) {
      return NextResponse.json({ error: "Paragraph not found" }, { status: 404 });
    }

    return NextResponse.json({ paragraph });
  } catch (error) {
    console.error("Get paragraph error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminAuth();
    await connectDB();

    const body = await req.json();
    const { title, content, difficulty, language, topics, isActive, metadata } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (difficulty !== undefined) {
      if (!Object.values(DifficultyLevel).includes(difficulty)) {
        return NextResponse.json({ error: "Invalid difficulty level" }, { status: 400 });
      }
      updateData.difficulty = difficulty;
    }
    if (language !== undefined) {
      if (!Object.values(Language).includes(language)) {
        return NextResponse.json({ error: "Invalid language" }, { status: 400 });
      }
      updateData.language = language;
    }
    if (topics !== undefined) updateData.topics = topics;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (metadata !== undefined) updateData.metadata = metadata;

    const paragraph = await Paragraph.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!paragraph) {
      return NextResponse.json({ error: "Paragraph not found" }, { status: 404 });
    }

    return NextResponse.json({ paragraph });
  } catch (error) {
    console.error("Update paragraph error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminAuth();
    await connectDB();

    const paragraph = await Paragraph.findByIdAndDelete(params.id);

    if (!paragraph) {
      return NextResponse.json({ error: "Paragraph not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete paragraph error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
