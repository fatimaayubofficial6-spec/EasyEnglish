"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DifficultyLevel } from "@/types/models";

interface DashboardFiltersProps {
  selectedDifficulty: string;
  selectedTopic: string;
  topics: string[];
  onDifficultyChange: (difficulty: string) => void;
  onTopicChange: (topic: string) => void;
}

export function DashboardFilters({
  selectedDifficulty,
  selectedTopic,
  topics,
  onDifficultyChange,
  onTopicChange,
}: DashboardFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Difficulty Level</h3>
        <Tabs value={selectedDifficulty} onValueChange={onDifficultyChange}>
          <TabsList>
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value={DifficultyLevel.BEGINNER}>Beginner</TabsTrigger>
            <TabsTrigger value={DifficultyLevel.INTERMEDIATE}>Intermediate</TabsTrigger>
            <TabsTrigger value={DifficultyLevel.ADVANCED}>Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {topics.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Topics</h3>
          <Tabs value={selectedTopic} onValueChange={onTopicChange}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All Topics</TabsTrigger>
              {topics.slice(0, 10).map((topic) => (
                <TabsTrigger key={topic} value={topic} className="capitalize">
                  {topic}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
}
