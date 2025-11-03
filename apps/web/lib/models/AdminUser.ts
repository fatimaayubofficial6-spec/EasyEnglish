import mongoose, { Schema, Model } from "mongoose";
import { IAdminUser, AdminRole } from "@/types/models";

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      required: true,
      default: AdminRole.MODERATOR,
    },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: function (permissions: string[]) {
          return permissions.length <= 50;
        },
        message: "Cannot have more than 50 permissions",
      },
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    createdBy: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance (email already indexed via unique constraint)
AdminUserSchema.index({ role: 1, isActive: 1 });
AdminUserSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const AdminUser: Model<IAdminUser> =
  (mongoose.models.AdminUser as Model<IAdminUser>) ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
