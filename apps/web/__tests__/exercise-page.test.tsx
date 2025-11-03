import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExerciseForm } from "@/components/exercise/ExerciseForm";
import { ExerciseLayout } from "@/components/exercise/ExerciseLayout";
import { DifficultyLevel } from "@/types/models";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe("ExerciseForm", () => {
  const mockPush = jest.fn();
  const defaultProps = {
    exerciseId: "test-id-123",
    title: "Test Exercise",
    content: "This is a test content for translation.",
    wordCount: 7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders the form with all elements", () => {
    render(<ExerciseForm {...defaultProps} />);

    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Speak")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Translation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your translation here...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Translation/i })).toBeInTheDocument();
  });

  it("shows the tip banner initially", () => {
    render(<ExerciseForm {...defaultProps} />);

    expect(screen.getByText(/Try to type out the translation from memory/i)).toBeInTheDocument();
  });

  it("dismisses the tip banner when close button is clicked", () => {
    render(<ExerciseForm {...defaultProps} />);

    const dismissButton = screen.getByLabelText("Dismiss tip");
    fireEvent.click(dismissButton);

    expect(
      screen.queryByText(/Try to type out the translation from memory/i)
    ).not.toBeInTheDocument();
  });

  it("disables submit button when text is too short", () => {
    render(<ExerciseForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /Submit Translation/i });
    expect(submitButton).toBeDisabled();

    const textarea = screen.getByPlaceholderText("Type your translation here...");
    fireEvent.change(textarea, { target: { value: "Short" } });

    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when text meets minimum length", () => {
    render(<ExerciseForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /Submit Translation/i });
    const textarea = screen.getByPlaceholderText("Type your translation here...");

    fireEvent.change(textarea, { target: { value: "This is a longer text that meets minimum" } });

    expect(submitButton).not.toBeDisabled();
  });

  it("updates character count as user types", () => {
    render(<ExerciseForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type your translation here...");

    expect(screen.getByText("0 / 10 min")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Hello World" } });

    expect(screen.getByText("11 / 10 min")).toBeInTheDocument();
  });

  it("successfully submits the form and redirects", async () => {
    const mockResponse = {
      success: true,
      attemptId: "attempt-123",
      score: 85,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<ExerciseForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type your translation here...");
    fireEvent.change(textarea, { target: { value: "This is my translation answer" } });

    const submitButton = screen.getByRole("button", { name: /Submit Translation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/exercises/test-id-123/submit",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.any(String),
        })
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/feedback/attempt-123");
    });
  });

  it("displays error message when submission fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    render(<ExerciseForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type your translation here...");
    fireEvent.change(textarea, { target: { value: "This is my translation answer" } });

    const submitButton = screen.getByRole("button", { name: /Submit Translation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => ({ success: true }) }), 100)
        )
    );

    render(<ExerciseForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type your translation here...");
    fireEvent.change(textarea, { target: { value: "This is my translation answer" } });

    const submitButton = screen.getByRole("button", { name: /Submit Translation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
    });
  });

  it("marks Speak button as disabled with tooltip", () => {
    render(<ExerciseForm {...defaultProps} />);

    const speakButton = screen.getByRole("button", { name: /Speak/i });
    expect(speakButton).toBeDisabled();
    expect(screen.getByText("Soon")).toBeInTheDocument();
  });
});

describe("ExerciseLayout", () => {
  const defaultProps = {
    exerciseId: "test-id-123",
    title: "Test Exercise",
    difficulty: DifficultyLevel.INTERMEDIATE,
    topics: ["grammar", "vocabulary"],
    estimatedMinutes: 5,
    content: "This is the English content.",
    wordCount: 5,
  };

  it("renders split layout with both panels", () => {
    render(
      <ExerciseLayout
        {...defaultProps}
        translation="Esto es el contenido en español."
        translationLanguage="es"
      />
    );

    expect(screen.getByText(/In Your Language/i)).toBeInTheDocument();
    expect(screen.getByText(/Type in English/i)).toBeInTheDocument();
    expect(screen.getByText("Esto es el contenido en español.")).toBeInTheDocument();
  });

  it("displays original content when translation is not available", () => {
    render(<ExerciseLayout {...defaultProps} />);

    expect(screen.getByText(/Original Text/i)).toBeInTheDocument();
    expect(screen.getByText("This is the English content.")).toBeInTheDocument();
  });

  it("shows translation error message when translation fails", () => {
    render(<ExerciseLayout {...defaultProps} translationError="Translation service unavailable" />);

    expect(screen.getByText(/Translation unavailable/i)).toBeInTheDocument();
    expect(screen.getByText("Translation service unavailable")).toBeInTheDocument();
  });

  it("displays difficulty badge with correct color", () => {
    const { container } = render(<ExerciseLayout {...defaultProps} />);

    const badge = screen.getByText("intermediate");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-yellow-500/20");
  });

  it("displays topics and estimated time", () => {
    render(<ExerciseLayout {...defaultProps} />);

    expect(screen.getByText("grammar")).toBeInTheDocument();
    expect(screen.getByText("vocabulary")).toBeInTheDocument();
    expect(screen.getByText("5 min")).toBeInTheDocument();
  });
});
