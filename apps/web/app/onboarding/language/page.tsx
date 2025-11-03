"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { Search, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LANGUAGES,
  POPULAR_LANGUAGES,
  OTHER_LANGUAGES,
  searchLanguages,
  type LanguageData,
} from "@/data/languages";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function LanguageOnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasLoadedUserLanguage, setHasLoadedUserLanguage] = useState(false);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return { popular: POPULAR_LANGUAGES, other: OTHER_LANGUAGES };
    }

    const results = searchLanguages(searchQuery);
    return {
      popular: results.filter((lang) => lang.isPopular),
      other: results.filter((lang) => !lang.isPopular),
    };
  }, [searchQuery]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user;
      if (user.onboardingCompleted) {
        if (user.subscriptionStatus === "active") {
          router.replace("/dashboard");
        } else {
          router.replace("/subscribe");
        }
      } else if (!hasLoadedUserLanguage && user.nativeLanguage) {
        const userLanguage = LANGUAGES.find((lang) => lang.code === user.nativeLanguage);
        if (userLanguage) {
          setSelectedLanguage(userLanguage);
        }
        setHasLoadedUserLanguage(true);
      }
    }
  }, [status, session, router, hasLoadedUserLanguage]);

  useEffect(() => {
    const handleDebounce = setTimeout(() => {}, 300);
    return () => clearTimeout(handleDebounce);
  }, [searchQuery]);

  const handleLanguageSelect = (language: LanguageData) => {
    setSelectedLanguage(language);
  };

  const handleContinue = async () => {
    if (!selectedLanguage || !session?.user?.email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/language", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nativeLanguage: selectedLanguage.code,
          nativeLanguageName: selectedLanguage.englishName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update language");
      }

      await update();

      setShowConfirmation(true);

      setTimeout(() => {
        router.push("/subscribe");
      }, 1500);
    } catch (error) {
      console.error("Error updating language:", error);
      setIsSubmitting(false);
      alert("Failed to update language. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  }

  if (showConfirmation) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="flex min-h-screen items-center justify-center px-4">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <Card className="glass-hover w-full max-w-md text-center">
              <CardContent className="space-y-4 pt-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">All set!</h2>
                  <p className="mt-2 text-muted-foreground">
                    Your language preference has been saved.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to subscription...</span>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <m.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-4xl"
        >
          <Card className="glass-hover">
            <CardHeader className="space-y-2 text-center">
              <m.div variants={itemVariants}>
                <CardTitle className="text-3xl font-bold sm:text-4xl">
                  Welcome, {session.user?.name?.split(" ")[0]}! 👋
                </CardTitle>
              </m.div>
              <m.div variants={itemVariants}>
                <CardDescription className="text-base sm:text-lg">
                  Let&apos;s start by selecting your native language. This helps us personalize
                  your learning experience.
                </CardDescription>
              </m.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <m.div variants={itemVariants} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search languages"
                />
              </m.div>

              {filteredLanguages.popular.length > 0 && (
                <m.div variants={itemVariants} className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Popular Languages</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {filteredLanguages.popular.map((language) => (
                      <LanguageCard
                        key={language.code}
                        language={language}
                        isSelected={selectedLanguage?.code === language.code}
                        onSelect={handleLanguageSelect}
                      />
                    ))}
                  </div>
                </m.div>
              )}

              {filteredLanguages.other.length > 0 && (
                <m.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      {searchQuery.trim() ? "Other Matches" : "All Languages"}
                    </h3>
                    {!searchQuery.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllLanguages(!showAllLanguages)}
                        className="h-auto p-1"
                      >
                        {showAllLanguages ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span className="ml-1">Show Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span className="ml-1">Show All ({filteredLanguages.other.length})</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {(showAllLanguages || searchQuery.trim()) && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {filteredLanguages.other.map((language) => (
                        <LanguageCard
                          key={language.code}
                          language={language}
                          isSelected={selectedLanguage?.code === language.code}
                          onSelect={handleLanguageSelect}
                        />
                      ))}
                    </div>
                  )}
                </m.div>
              )}

              {filteredLanguages.popular.length === 0 && filteredLanguages.other.length === 0 && (
                <m.div variants={itemVariants} className="py-8 text-center text-muted-foreground">
                  No languages found matching &quot;{searchQuery}&quot;
                </m.div>
              )}

              <m.div variants={itemVariants} className="space-y-3 pt-4">
                {selectedLanguage && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <span className="text-2xl">{selectedLanguage.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{selectedLanguage.englishName}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedLanguage.nativeName}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Selected
                    </Badge>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedLanguage || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </m.div>
            </CardContent>
          </Card>
        </m.div>
      </div>
    </LazyMotion>
  );
}

interface LanguageCardProps {
  language: LanguageData;
  isSelected: boolean;
  onSelect: (language: LanguageData) => void;
}

function LanguageCard({ language, isSelected, onSelect }: LanguageCardProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.button
        onClick={() => onSelect(language)}
        className={`focus-ring group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary hover:shadow-lg ${
          isSelected ? "glass border-primary shadow-lg ring-2 ring-primary/20" : "border-border"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-pressed={isSelected}
        aria-label={`Select ${language.englishName} as your native language`}
      >
        {isSelected && (
          <m.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute right-2 top-2"
          >
            <CheckCircle className="h-5 w-5 text-primary" />
          </m.div>
        )}
        <span className="text-3xl transition-transform group-hover:scale-110">
          {language.flag}
        </span>
        <div className="text-center">
          <div className="text-sm font-medium">{language.englishName}</div>
          {language.nativeName !== language.englishName && (
            <div className="text-xs text-muted-foreground">{language.nativeName}</div>
          )}
        </div>
      </m.button>
    </LazyMotion>
  );
}
