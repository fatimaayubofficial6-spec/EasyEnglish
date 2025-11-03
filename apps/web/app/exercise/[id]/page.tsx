import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { AppShell, MainContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExerciseLayout, ExerciseLoading } from "@/components/exercise";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ExerciseData {
  id: string;
  title: string;
  content: string;
  difficulty: string;
  language: string;
  topics: string[];
  wordCount: number;
  estimatedMinutes: number;
  translation?: string;
  translationLanguage?: string;
  translationError?: string;
}

async function fetchExercise(id: string): Promise<ExerciseData | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/exercises/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch exercise");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching exercise:", error);
    throw error;
  }
}

async function ExerciseContent({ id }: { id: string }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  let exercise: ExerciseData | null = null;
  let fetchError = false;

  try {
    exercise = await fetchExercise(id);
  } catch (error) {
    console.error("Exercise fetch error:", error);
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to Load Exercise</AlertTitle>
          <AlertDescription>
            There was an error loading the exercise. Please try again or contact support if the
            problem persists.
          </AlertDescription>
        </Alert>

        <Link href="/dashboard">
          <Button size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!exercise) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="text-sm text-muted-foreground">Step 1 of 2</div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
        <p className="text-muted-foreground">
          Translate this text to improve your English typing and comprehension skills.
        </p>
      </div>

      <ExerciseLayout
        exerciseId={exercise.id}
        title={exercise.title}
        difficulty={exercise.difficulty as any}
        topics={exercise.topics}
        estimatedMinutes={exercise.estimatedMinutes}
        content={exercise.content}
        wordCount={exercise.wordCount}
        translation={exercise.translation}
        translationLanguage={exercise.translationLanguage}
        translationError={exercise.translationError}
      />
    </div>
  );
}

export default function ExercisePage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <MainContent id="main-content">
        <Suspense fallback={<ExerciseLoading />}>
          <ExerciseContent id={params.id} />
        </Suspense>
      </MainContent>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
