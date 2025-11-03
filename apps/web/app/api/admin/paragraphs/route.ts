import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import connectDB from "@/lib/db/mongoose";
import Paragraph from "@/lib/models/Paragraph";
import { DifficultyLevel, Language } from "@/types/models";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth();
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const topic = searchParams.get("topic") || "";

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (difficulty && Object.values(DifficultyLevel).includes(difficulty as DifficultyLevel)) {
      query.difficulty = difficulty;
    }

    if (topic) {
      query.topics = topic;
    }

    const skip = (page - 1) * limit;

    const [paragraphs, total] = await Promise.all([
      Paragraph.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Paragraph.countDocuments(query),
    ]);

    return NextResponse.json({
      paragraphs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get paragraphs error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth();
    await connectDB();

    const body = await req.json();
    const { title, content, difficulty, language, topics, metadata } = body;

    if (!title || !content || !difficulty) {
      return NextResponse.json(
        { error: "Title, content, and difficulty are required" },
        { status: 400 }
      );
    }

    if (!Object.values(DifficultyLevel).includes(difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty level" }, { status: 400 });
    }

    if (language && !Object.values(Language).includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    const paragraph = await Paragraph.create({
      title,
      content,
      difficulty,
      language: language || Language.ENGLISH,
      topics: topics || [],
      metadata: metadata || {},
    });

    return NextResponse.json({ paragraph }, { status: 201 });
  } catch (error) {
    console.error("Create paragraph error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
