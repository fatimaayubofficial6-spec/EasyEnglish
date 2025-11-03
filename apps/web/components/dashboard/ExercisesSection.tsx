"use client";

import { useState, useEffect } from "react";
import { DashboardFilters } from "./DashboardFilters";
import { ExerciseCard } from "./ExerciseCard";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { DifficultyLevel } from "@/types/models";

interface Exercise {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  topics: string[];
  wordCount: number;
  estimatedMinutes: number;
  attempted: boolean;
  completed: boolean;
  bestScore: number;
}

interface ExercisesSectionProps {
  initialExercises: Exercise[];
  topics: string[];
}

export function ExercisesSection({ initialExercises, topics }: ExercisesSectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (selectedDifficulty !== "all") {
        params.set("difficulty", selectedDifficulty);
      }
      if (selectedTopic !== "all") {
        params.set("topic", selectedTopic);
      }

      try {
        const response = await fetch(`/api/exercises?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setExercises(data.exercises || []);
        } else {
          console.error("Failed to fetch exercises:", data.error);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [selectedDifficulty, selectedTopic]);

  const handleClearFilters = () => {
    setSelectedDifficulty("all");
    setSelectedTopic("all");
  };

  const hasFilters = selectedDifficulty !== "all" || selectedTopic !== "all";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Exercises</h2>
        <DashboardFilters
          selectedDifficulty={selectedDifficulty}
          selectedTopic={selectedTopic}
          topics={topics}
          onDifficultyChange={setSelectedDifficulty}
          onTopicChange={setSelectedTopic}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} {...exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
