import mongoose, { Schema, Model } from "mongoose";
import {
  IUser,
  SubscriptionTier,
  SubscriptionStatus,
  Language,
} from "@/types/models";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    nativeLanguage: {
      type: String,
    },
    nativeLanguageName: {
      type: String,
    },
    learningLanguage: {
      type: String,
      enum: Object.values(Language),
      default: Language.ENGLISH,
      required: true,
    },
    subscriptionTier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      default: SubscriptionTier.FREE,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
      required: true,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripePriceId: {
      type: String,
    },
    nextBillingDate: {
      type: Date,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    lastExerciseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance (email and googleId already indexed via unique constraint)
UserSchema.index({ subscriptionTier: 1, subscriptionStatus: 1 });
UserSchema.index({ createdAt: -1 });

// Prevent model recompilation in development (hot reload)
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
