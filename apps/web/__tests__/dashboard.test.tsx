import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DifficultyLevel } from "@/types/models";

describe("Dashboard Components", () => {
  describe("ExerciseCard", () => {
    const defaultProps = {
      id: "123",
      title: "Test Exercise",
      difficulty: DifficultyLevel.BEGINNER,
      topics: ["grammar", "vocabulary"],
      estimatedMinutes: 5,
      attempted: false,
      completed: false,
      bestScore: 0,
    };

    it("renders exercise card with correct information", () => {
      render(<ExerciseCard {...defaultProps} />);

      expect(screen.getByText("Test Exercise")).toBeInTheDocument();
      expect(screen.getByText("beginner")).toBeInTheDocument();
      expect(screen.getByText("5 min")).toBeInTheDocument();
      expect(screen.getByText("grammar")).toBeInTheDocument();
      expect(screen.getByText("vocabulary")).toBeInTheDocument();
    });

    it("displays start button for new exercise", () => {
      render(<ExerciseCard {...defaultProps} />);

      expect(screen.getByText("Start Exercise")).toBeInTheDocument();
    });

    it("displays continue button for attempted exercise", () => {
      render(<ExerciseCard {...defaultProps} attempted={true} bestScore={50} />);

      expect(screen.getByText("Continue")).toBeInTheDocument();
      expect(screen.getByText(/Best score: 50%/)).toBeInTheDocument();
    });

    it("displays review button and checkmark for completed exercise", () => {
      render(<ExerciseCard {...defaultProps} completed={true} bestScore={85} />);

      expect(screen.getByText("Review Exercise")).toBeInTheDocument();
      // Check icon is rendered (CheckCircle2 from lucide-react)
      const cardElement = screen.getByText("Review Exercise").closest(".glass");
      expect(cardElement).toBeInTheDocument();
    });

    it("renders correct difficulty badge color for beginner", () => {
      render(<ExerciseCard {...defaultProps} difficulty={DifficultyLevel.BEGINNER} />);

      const badge = screen.getByText("beginner");
      expect(badge).toHaveClass("text-green-700");
    });

    it("renders correct difficulty badge color for intermediate", () => {
      render(<ExerciseCard {...defaultProps} difficulty={DifficultyLevel.INTERMEDIATE} />);

      const badge = screen.getByText("intermediate");
      expect(badge).toHaveClass("text-yellow-700");
    });

    it("renders correct difficulty badge color for advanced", () => {
      render(<ExerciseCard {...defaultProps} difficulty={DifficultyLevel.ADVANCED} />);

      const badge = screen.getByText("advanced");
      expect(badge).toHaveClass("text-red-700");
    });

    it("shows only first 3 topics plus count badge when more than 3", () => {
      const manyTopics = ["topic1", "topic2", "topic3", "topic4", "topic5"];
      render(<ExerciseCard {...defaultProps} topics={manyTopics} />);

      expect(screen.getByText("topic1")).toBeInTheDocument();
      expect(screen.getByText("topic2")).toBeInTheDocument();
      expect(screen.getByText("topic3")).toBeInTheDocument();
      expect(screen.getByText("+2")).toBeInTheDocument();
      expect(screen.queryByText("topic4")).not.toBeInTheDocument();
    });

    it("renders link to exercise detail page", () => {
      render(<ExerciseCard {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/exercise/123");
    });
  });

  describe("DashboardFilters", () => {
    const mockDifficultyChange = jest.fn();
    const mockTopicChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const defaultProps = {
      selectedDifficulty: "all",
      selectedTopic: "all",
      topics: ["grammar", "vocabulary", "reading"],
      onDifficultyChange: mockDifficultyChange,
      onTopicChange: mockTopicChange,
    };

    it("renders difficulty filter with all options", () => {
      render(<DashboardFilters {...defaultProps} />);

      expect(screen.getByText("Difficulty Level")).toBeInTheDocument();
      expect(screen.getByText("All Levels")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();
      expect(screen.getByText("Intermediate")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
    });

    it("renders topic filter with provided topics", () => {
      render(<DashboardFilters {...defaultProps} />);

      expect(screen.getByText("Topics")).toBeInTheDocument();
      expect(screen.getByText("All Topics")).toBeInTheDocument();
      expect(screen.getByText("grammar")).toBeInTheDocument();
      expect(screen.getByText("vocabulary")).toBeInTheDocument();
      expect(screen.getByText("reading")).toBeInTheDocument();
    });

    it("does not render topic filter when no topics available", () => {
      render(<DashboardFilters {...defaultProps} topics={[]} />);

      expect(screen.queryByText("Topics")).not.toBeInTheDocument();
    });

    it("limits topics to 10", () => {
      const manyTopics = Array.from({ length: 15 }, (_, i) => `topic${i + 1}`);
      render(<DashboardFilters {...defaultProps} topics={manyTopics} />);

      expect(screen.getByText("topic1")).toBeInTheDocument();
      expect(screen.getByText("topic10")).toBeInTheDocument();
      expect(screen.queryByText("topic11")).not.toBeInTheDocument();
    });

    it("renders difficulty tabs as buttons", () => {
      render(<DashboardFilters {...defaultProps} />);

      const beginnerButton = screen.getByRole("tab", { name: "Beginner" });
      expect(beginnerButton).toBeInTheDocument();
      expect(beginnerButton).toHaveAttribute("type", "button");
    });

    it("renders topic tabs as buttons", () => {
      render(<DashboardFilters {...defaultProps} />);

      const grammarButton = screen.getByRole("tab", { name: "grammar" });
      expect(grammarButton).toBeInTheDocument();
      expect(grammarButton).toHaveAttribute("type", "button");
    });
  });

  describe("EmptyState", () => {
    const mockClearFilters = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders filter-specific message when filters are active", () => {
      render(<EmptyState hasFilters={true} onClearFilters={mockClearFilters} />);

      expect(screen.getByText("No exercises found")).toBeInTheDocument();
      expect(
        screen.getByText(/couldn't find any exercises matching your filters/)
      ).toBeInTheDocument();
      expect(screen.getByText("Clear Filters")).toBeInTheDocument();
    });

    it("calls onClearFilters when clear button is clicked", () => {
      render(<EmptyState hasFilters={true} onClearFilters={mockClearFilters} />);

      const clearButton = screen.getByText("Clear Filters");
      fireEvent.click(clearButton);

      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });

    it("renders generic message when no filters are active", () => {
      render(<EmptyState hasFilters={false} onClearFilters={mockClearFilters} />);

      expect(screen.getByText("No exercises available yet")).toBeInTheDocument();
      expect(screen.getByText(/working hard to add new exercises/)).toBeInTheDocument();
      expect(screen.getByText("Contact Support")).toBeInTheDocument();
    });

    it("does not show clear filters button when no filters active", () => {
      render(<EmptyState hasFilters={false} onClearFilters={mockClearFilters} />);

      expect(screen.queryByText("Clear Filters")).not.toBeInTheDocument();
    });
  });
});
