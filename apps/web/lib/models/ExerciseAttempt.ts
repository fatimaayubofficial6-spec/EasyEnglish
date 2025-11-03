import mongoose, { Schema, Model } from "mongoose";
import { IExerciseAttempt, ExerciseType } from "@/types/models";

const ExerciseAttemptSchema = new Schema<IExerciseAttempt>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    paragraphId: {
      type: String,
      required: true,
      ref: "Paragraph",
    },
    exerciseType: {
      type: String,
      enum: Object.values(ExerciseType),
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
    },
    score: {
      type: Number,
      required: true,
      min: [0, "Score must be at least 0"],
      max: [100, "Score cannot exceed 100"],
    },
    feedback: {
      type: String,
    },
    aiAnalysis: {
      strengths: {
        type: [String],
        default: [],
      },
      improvements: {
        type: [String],
        default: [],
      },
      suggestions: {
        type: [String],
        default: [],
      },
    },
    timeSpentSeconds: {
      type: Number,
      min: [0, "Time spent cannot be negative"],
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
ExerciseAttemptSchema.index({ userId: 1, completedAt: -1 });
ExerciseAttemptSchema.index({ paragraphId: 1 });
ExerciseAttemptSchema.index({ exerciseType: 1 });
ExerciseAttemptSchema.index({ score: 1 });
ExerciseAttemptSchema.index({ createdAt: -1 });

// Compound index for user statistics
ExerciseAttemptSchema.index({ userId: 1, exerciseType: 1, completedAt: -1 });

// Prevent model recompilation in development
const ExerciseAttempt: Model<IExerciseAttempt> =
  (mongoose.models.ExerciseAttempt as Model<IExerciseAttempt>) ||
  mongoose.model<IExerciseAttempt>("ExerciseAttempt", ExerciseAttemptSchema);

export default ExerciseAttempt;
