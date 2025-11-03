import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  GrammarMistakes,
  TensesBadges,
  KeyVocabulary,
  FeedbackSummary,
  FeedbackActions,
  FeedbackError,
} from "@/components/feedback";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({
    attemptId: "507f1f77bcf86cd799439011",
  }),
}));

describe("Feedback Components", () => {
  describe("GrammarMistakes", () => {
    const mockMistakes = [
      {
        mistake: "I have went",
        correction: "I have gone",
        explanation: "Use 'gone' as the past participle of 'go'",
      },
      {
        mistake: "She don't like",
        correction: "She doesn't like",
        explanation: "Use 'doesn't' with third-person singular",
      },
    ];

    it("should render grammar mistakes with accordion", () => {
      render(<GrammarMistakes mistakes={mockMistakes} />);

      expect(screen.getByText("Grammar Analysis")).toBeInTheDocument();
      expect(screen.getByText("2 areas for improvement")).toBeInTheDocument();
      expect(screen.getByText("I have went")).toBeInTheDocument();
      expect(screen.getByText("She don't like")).toBeInTheDocument();
    });

    it("should show no mistakes message when array is empty", () => {
      render(<GrammarMistakes mistakes={[]} />);

      expect(screen.getByText("Grammar Analysis")).toBeInTheDocument();
      expect(screen.getByText("No major grammar mistakes found!")).toBeInTheDocument();
    });

    it("should expand accordion item to show details", () => {
      render(<GrammarMistakes mistakes={mockMistakes} />);

      const firstMistake = screen.getByText("I have went");
      fireEvent.click(firstMistake);

      expect(screen.getByText("Correction:")).toBeInTheDocument();
      expect(screen.getByText("I have gone")).toBeInTheDocument();
      expect(screen.getByText("Explanation:")).toBeInTheDocument();
    });
  });

  describe("TensesBadges", () => {
    it("should render tense badges", () => {
      const tenses = ["Present Simple", "Past Perfect", "Future Continuous"];
      render(<TensesBadges tenses={tenses} />);

      expect(screen.getByText("Key Tenses")).toBeInTheDocument();
      expect(screen.getByText("Present Simple")).toBeInTheDocument();
      expect(screen.getByText("Past Perfect")).toBeInTheDocument();
      expect(screen.getByText("Future Continuous")).toBeInTheDocument();
    });

    it("should not render when no tenses provided", () => {
      const { container } = render(<TensesBadges tenses={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when tenses is undefined", () => {
      const { container } = render(<TensesBadges />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("KeyVocabulary", () => {
    const mockVocabulary = [
      {
        word: "eloquent",
        definition: "Fluent or persuasive in speaking or writing",
        example: "She gave an eloquent speech.",
      },
      {
        word: "ambitious",
        definition: "Having a strong desire for success or achievement",
        example: "He is an ambitious entrepreneur.",
      },
    ];

    it("should render vocabulary cards", () => {
      render(<KeyVocabulary vocabulary={mockVocabulary} />);

      expect(screen.getByText("Key Vocabulary")).toBeInTheDocument();
      expect(screen.getByText("eloquent")).toBeInTheDocument();
      expect(screen.getByText("Fluent or persuasive in speaking or writing")).toBeInTheDocument();
      expect(screen.getByText(/She gave an eloquent speech/)).toBeInTheDocument();
      expect(screen.getByText("ambitious")).toBeInTheDocument();
    });

    it("should not render when no vocabulary provided", () => {
      const { container } = render(<KeyVocabulary vocabulary={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when vocabulary is undefined", () => {
      const { container } = render(<KeyVocabulary />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("FeedbackSummary", () => {
    const mockFeedback = {
      strengths: ["Good vocabulary usage", "Clear sentence structure"],
      improvements: ["Work on verb tenses", "Use more complex sentences"],
      suggestions: ["Practice with past tense exercises", "Read more English literature"],
      overallFeedback: "Great effort! You're making good progress.",
    };

    it("should render all feedback sections", () => {
      render(<FeedbackSummary {...mockFeedback} />);

      expect(screen.getByText("Overall Feedback")).toBeInTheDocument();
      expect(screen.getByText("Great effort! You're making good progress.")).toBeInTheDocument();
      expect(screen.getByText("Strengths")).toBeInTheDocument();
      expect(screen.getByText("Improvements")).toBeInTheDocument();
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
    });

    it("should render strengths with checkmarks", () => {
      render(<FeedbackSummary {...mockFeedback} />);

      expect(screen.getByText("Good vocabulary usage")).toBeInTheDocument();
      expect(screen.getByText("Clear sentence structure")).toBeInTheDocument();
    });

    it("should render improvements and suggestions", () => {
      render(<FeedbackSummary {...mockFeedback} />);

      expect(screen.getByText("Work on verb tenses")).toBeInTheDocument();
      expect(screen.getByText("Practice with past tense exercises")).toBeInTheDocument();
    });

    it("should handle empty arrays gracefully", () => {
      render(<FeedbackSummary strengths={[]} improvements={[]} suggestions={[]} />);

      expect(screen.queryByText("Strengths")).not.toBeInTheDocument();
      expect(screen.queryByText("Improvements")).not.toBeInTheDocument();
      expect(screen.queryByText("Suggestions")).not.toBeInTheDocument();
    });
  });

  describe("FeedbackActions", () => {
    it("should render all action buttons", () => {
      render(<FeedbackActions paragraphId="507f1f77bcf86cd799439012" pdfReady={true} />);

      expect(screen.getByText("Next Exercise")).toBeInTheDocument();
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
      expect(screen.getByText("Review Again")).toBeInTheDocument();
    });

    it("should disable PDF button when not ready", () => {
      render(<FeedbackActions paragraphId="507f1f77bcf86cd799439012" pdfReady={false} />);

      const pdfButton = screen.getByText("PDF Processing...");
      expect(pdfButton).toBeInTheDocument();
      expect(pdfButton.closest("button")).toBeDisabled();
    });

    it("should handle PDF download click", async () => {
      render(<FeedbackActions paragraphId="507f1f77bcf86cd799439012" pdfReady={true} />);

      const pdfButton = screen.getByText("Download PDF");
      fireEvent.click(pdfButton);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });
  });

  describe("FeedbackError", () => {
    it("should render error message", () => {
      render(<FeedbackError error="Failed to load feedback" />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Failed to load feedback")).toBeInTheDocument();
    });

    it("should show retry button when onRetry provided", () => {
      const onRetry = jest.fn();
      render(<FeedbackError error="Network error" onRetry={onRetry} />);

      const retryButton = screen.getByText("Try Again");
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("should show retry exercise button when paragraphId provided", () => {
      render(<FeedbackError error="Error" paragraphId="507f1f77bcf86cd799439012" />);

      expect(screen.getByText("Retry Exercise")).toBeInTheDocument();
    });

    it("should always show back to dashboard button", () => {
      render(<FeedbackError error="Error" />);

      expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
    });
  });
});
