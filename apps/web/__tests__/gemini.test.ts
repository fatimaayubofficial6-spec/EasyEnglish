/**
 * @jest-environment node
 */

// Set environment variable before importing the module
process.env.GEMINI_API_KEY = "test-api-key";

// Mock the @google/generative-ai module
const mockGenerateContent = jest.fn();

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

// Import after mocking
import { translateText, generateFeedback, isGeminiConfigured } from "../lib/ai/gemini";

describe("Gemini AI Client", () => {
  beforeEach(() => {
    mockGenerateContent.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Configuration", () => {
    it("should be configured when API key is set", () => {
      expect(isGeminiConfigured()).toBe(true);
    });
  });

  describe("translateText", () => {
    it("should successfully translate text", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => "Hola, ¿cómo estás?",
        },
      });

      const result = await translateText(
        "Hello, how are you?",
        "en",
        "es",
        "Spanish"
      );

      expect(result.success).toBe(true);
      expect(result.translation).toBe("Hola, ¿cómo estás?");
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it("should handle translation failure", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

      const result = await translateText("Hello", "en", "es");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.translation).toBeUndefined();
    });

    it("should handle empty translation response", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => "",
        },
      });

      const result = await translateText("Hello", "en", "es");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Empty translation received");
    });
  });

  describe("generateFeedback", () => {
    it("should successfully generate feedback", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => JSON.stringify({
            score: 85,
            strengths: ["Good grammar", "Clear meaning"],
            improvements: ["Could use more advanced vocabulary"],
            suggestions: ["Try using synonyms to vary your language"],
            overallFeedback: "Good translation with room for improvement.",
          }),
        },
      });

      const result = await generateFeedback(
        "translation",
        "Hello, how are you?",
        "Hola, ¿cómo estás?",
        "Hola, ¿cómo está?"
      );

      expect(result.success).toBe(true);
      expect(result.feedback).toBeDefined();
      expect(result.feedback?.score).toBe(85);
      expect(result.feedback?.strengths).toHaveLength(2);
      expect(result.feedback?.improvements).toHaveLength(1);
      expect(result.feedback?.suggestions).toHaveLength(1);
    });

    it("should handle different exercise types", async () => {
      const exerciseTypes = ["translation", "gap_fill", "rewrite", "comprehension"];

      for (const exerciseType of exerciseTypes) {
        mockGenerateContent.mockResolvedValueOnce({
          response: {
            text: () => JSON.stringify({
              score: 90,
              strengths: ["Excellent accuracy"],
              improvements: ["Minor formatting issues"],
              suggestions: ["Pay attention to punctuation"],
              overallFeedback: "Very good work!",
            }),
          },
        });

        const result = await generateFeedback(
          exerciseType,
          "Test content",
          "User answer"
        );

        expect(result.success).toBe(true);
        expect(result.feedback?.score).toBe(90);
      }
    });

    it("should handle feedback generation failure", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

      const result = await generateFeedback(
        "translation",
        "Test",
        "Answer"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.feedback).toBeUndefined();
    });

    it("should handle malformed JSON response", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => "This is not valid JSON",
        },
      });

      const result = await generateFeedback(
        "translation",
        "Test",
        "Answer"
      );

      expect(result.success).toBe(true);
      expect(result.feedback?.score).toBe(50); // Default fallback
      expect(result.feedback?.strengths).toContain("You completed the exercise");
    });

    it("should parse JSON from text with extra content", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => `Here is your feedback:
{
  "score": 75,
  "strengths": ["Good effort"],
  "improvements": ["Practice more"],
  "suggestions": ["Keep going"],
  "overallFeedback": "Nice work!"
}
That's the end of the feedback.`,
        },
      });

      const result = await generateFeedback(
        "translation",
        "Test",
        "Answer"
      );

      expect(result.success).toBe(true);
      expect(result.feedback?.score).toBe(75);
      expect(result.feedback?.overallFeedback).toBe("Nice work!");
    });
  });
});
