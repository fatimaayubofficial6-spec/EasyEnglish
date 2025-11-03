import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Paragraph from "@/lib/models/Paragraph";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import { SubscriptionStatus } from "@/types/models";

export async function GET() {
  try {
    await requireAdminAuth();
    await connectDB();

    // Get active subscribers count
    const activeSubscribers = await User.countDocuments({
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    });

    // Calculate MRR (Monthly Recurring Revenue)
    // Assuming $10/month per premium subscription
    const premiumSubscribers = await User.countDocuments({
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionTier: "premium",
    });
    const mrr = premiumSubscribers * 10;

    // Get daily exercise completions (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const dailyCompletions = await ExerciseAttempt.countDocuments({
      completedAt: { $gte: oneDayAgo },
    });

    // Get total paragraph count
    const paragraphCount = await Paragraph.countDocuments({ isActive: true });

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyCompletions = await ExerciseAttempt.countDocuments({
      completedAt: { $gte: sevenDaysAgo },
    });

    return NextResponse.json({
      stats: {
        activeSubscribers,
        mrr,
        dailyCompletions,
        paragraphCount,
        totalUsers,
        weeklyCompletions,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
