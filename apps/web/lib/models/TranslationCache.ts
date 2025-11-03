import mongoose, { Schema, Model } from "mongoose";
import { ITranslationCache, Language } from "@/types/models";

const TranslationCacheSchema = new Schema<ITranslationCache>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    sourceLang: {
      type: String,
      enum: Object.values(Language),
      required: true,
    },
    targetLang: {
      type: String,
      enum: Object.values(Language),
      required: true,
    },
    translation: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      default: "openai",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Cache for 30 days
        return date;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient cache lookup
TranslationCacheSchema.index({ text: 1, sourceLang: 1, targetLang: 1 }, { unique: true });
TranslationCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Prevent model recompilation in development
const TranslationCache: Model<ITranslationCache> =
  (mongoose.models.TranslationCache as Model<ITranslationCache>) ||
  mongoose.model<ITranslationCache>("TranslationCache", TranslationCacheSchema);

export default TranslationCache;
