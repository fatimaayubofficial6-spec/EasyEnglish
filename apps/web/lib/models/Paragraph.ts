import mongoose, { Schema, Model } from "mongoose";
import { IParagraph, DifficultyLevel, Language } from "@/types/models";

const ParagraphSchema = new Schema<IParagraph>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: true,
      minlength: [50, "Content must be at least 50 characters"],
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
    },
    language: {
      type: String,
      enum: Object.values(Language),
      required: true,
      default: Language.ENGLISH,
    },
    topics: {
      type: [String],
      default: [],
      validate: {
        validator: function (topics: string[]) {
          return topics.length <= 10;
        },
        message: "Cannot have more than 10 topics",
      },
    },
    wordCount: {
      type: Number,
      default: 0,
      min: [0, "Word count must be non-negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    metadata: {
      source: {
        type: String,
        trim: true,
      },
      author: {
        type: String,
        trim: true,
      },
      publicationDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
ParagraphSchema.index({ difficulty: 1, language: 1, isActive: 1 });
ParagraphSchema.index({ topics: 1 });
ParagraphSchema.index({ wordCount: 1 });
ParagraphSchema.index({ createdAt: -1 });

// Pre-save hook to calculate word count
ParagraphSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.wordCount = this.content.split(/\s+/).filter((word) => word.length > 0).length;
  }
  next();
});

// Prevent model recompilation in development
const Paragraph: Model<IParagraph> =
  (mongoose.models.Paragraph as Model<IParagraph>) ||
  mongoose.model<IParagraph>("Paragraph", ParagraphSchema);

export default Paragraph;
