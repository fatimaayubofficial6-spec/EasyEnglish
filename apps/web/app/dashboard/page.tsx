import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell, MainContent } from "@/components/layout";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Paragraph from "@/lib/models/Paragraph";
import ExerciseAttempt from "@/lib/models/ExerciseAttempt";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ExercisesSection } from "@/components/dashboard/ExercisesSection";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { getUserStats, getAllTopics } from "@/lib/db/stats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { SubscriptionStatus } from "@/types/models";

async function DashboardContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  await connectDB();
  const dbUser = await User.findOne({ email: user.email }).lean();

  if (!dbUser) {
    redirect("/auth/signin");
  }

  // Check if user has inactive subscription
  const isInactive =
    dbUser.subscriptionStatus === SubscriptionStatus.CANCELED ||
    dbUser.subscriptionStatus === SubscriptionStatus.EXPIRED;

  if (isInactive) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription>
            Your subscription is {dbUser.subscriptionStatus}. Please subscribe to access the
            dashboard and exercises.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started with EasyEnglish</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Subscribe now to unlock unlimited access to exercises, personalized feedback, and more.
          </p>
          <Link href="/subscribe">
            <Button size="lg" className="gradient-text">
              View Plans & Subscribe
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch user stats
  const stats = await getUserStats(user.id!);

  // Fetch initial exercises (no filters)
  const paragraphs = await Paragraph.find({
    isActive: true,
    language: "en",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const paragraphIds = paragraphs.map((p) => p._id.toString());
  const attempts = await ExerciseAttempt.find({
    userId: user.id,
    paragraphId: { $in: paragraphIds },
  })
    .sort({ completedAt: -1 })
    .lean();

  // Create progress map
  const progressMap = new Map<
    string,
    { attempted: boolean; completed: boolean; bestScore: number }
  >();

  attempts.forEach((attempt) => {
    const paragraphId = attempt.paragraphId.toString();
    const existing = progressMap.get(paragraphId);

    if (!existing) {
      progressMap.set(paragraphId, {
        attempted: true,
        completed: attempt.score >= 70,
        bestScore: attempt.score,
      });
    } else {
      progressMap.set(paragraphId, {
        attempted: true,
        completed: existing.completed || attempt.score >= 70,
        bestScore: Math.max(existing.bestScore, attempt.score),
      });
    }
  });

  // Transform paragraphs to exercises
  const initialExercises = paragraphs.map((paragraph) => {
    const paragraphId = paragraph._id.toString();
    const progress = progressMap.get(paragraphId) || {
      attempted: false,
      completed: false,
      bestScore: 0,
    };

    const estimatedMinutes = Math.ceil(paragraph.wordCount / 50);

    return {
      id: paragraphId,
      title: paragraph.title,
      difficulty: paragraph.difficulty,
      topics: paragraph.topics,
      wordCount: paragraph.wordCount,
      estimatedMinutes,
      attempted: progress.attempted,
      completed: progress.completed,
      bestScore: progress.bestScore,
    };
  });

  // Get all available topics
  const topics = await getAllTopics();

  return (
    <div className="space-y-8">
      <DashboardHero userName={user.name || undefined} stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <ExercisesSection initialExercises={initialExercises} topics={topics} />
        <QuickLinks hasStripeCustomerId={!!dbUser.stripeCustomerId} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <MainContent id="main-content">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </MainContent>
    </AppShell>
  );
}
