"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "other", name: "Other", flag: "🌐" },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!selectedLanguage) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <Card className="glass-hover">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">
              Welcome, {session.user?.name?.split(" ")[0]}! 👋
            </CardTitle>
            <CardDescription className="text-base">
              Let&apos;s personalize your learning experience. What&apos;s your native language?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`focus-ring relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                    selectedLanguage === language.code
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/50"
                  }`}
                >
                  {selectedLanguage === language.code && (
                    <div className="absolute right-2 top-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <span className="text-3xl">{language.flag}</span>
                  <span className="text-sm font-medium">{language.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleComplete}
                disabled={!selectedLanguage || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-background" />
                    Setting up...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
              <Button
                className="w-full"
                size="lg"
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
