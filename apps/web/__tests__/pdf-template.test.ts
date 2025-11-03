/**
 * @jest-environment node
 */

import { generateLessonHtml, PdfLessonData } from "@/templates/pdfLesson";

describe("PDF Template Generation", () => {
  const baseLessonData: PdfLessonData = {
    lessonNumber: 1,
    title: "Introduction to English",
    originalText: "Hello, how are you?",
    userTranslation: "Hola, ¿cómo estás?",
    correctedVersion: "Hola, ¿cómo está usted?",
    score: 85,
    completedAt: new Date("2024-01-15T10:00:00Z"),
    difficulty: "beginner",
    topics: ["greetings", "conversation"],
  };

  describe("generateLessonHtml", () => {
    it("should generate valid HTML with basic lesson data", () => {
      const html = generateLessonHtml(baseLessonData);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("Lesson 1");
      expect(html).toContain("Introduction to English");
      expect(html).toContain("Hello, how are you?");
      expect(html).toContain("Hola, ¿cómo estás?");
      expect(html).toContain("85%");
    });

    it("should include difficulty badge", () => {
      const html = generateLessonHtml(baseLessonData);
      expect(html).toContain("beginner");
    });

    it("should include topics", () => {
      const html = generateLessonHtml(baseLessonData);
      expect(html).toContain("greetings");
      expect(html).toContain("conversation");
    });

    it("should format date correctly", () => {
      const html = generateLessonHtml(baseLessonData);
      expect(html).toContain("January 15, 2024");
    });

    it("should escape HTML in content", () => {
      const dataWithHtml = {
        ...baseLessonData,
        userTranslation: '<script>alert("xss")</script>',
      };

      const html = generateLessonHtml(dataWithHtml);

      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("should include grammar mistakes section when provided", () => {
      const dataWithMistakes = {
        ...baseLessonData,
        grammarMistakes: [
          {
            mistake: "I goes to school",
            correction: "I go to school",
            explanation: "Subject-verb agreement error",
          },
        ],
      };

      const html = generateLessonHtml(dataWithMistakes);

      expect(html).toContain("Grammar Corrections");
      expect(html).toContain("I goes to school");
      expect(html).toContain("I go to school");
      expect(html).toContain("Subject-verb agreement error");
    });

    it("should include key vocabulary section when provided", () => {
      const dataWithVocab = {
        ...baseLessonData,
        keyVocabulary: [
          {
            word: "Hello",
            definition: "A greeting",
            example: "Hello, how are you?",
          },
        ],
      };

      const html = generateLessonHtml(dataWithVocab);

      expect(html).toContain("Key Vocabulary");
      expect(html).toContain("Hello");
      expect(html).toContain("A greeting");
    });

    it("should include tenses section when provided", () => {
      const dataWithTenses = {
        ...baseLessonData,
        tenses: ["Present Simple", "Present Continuous"],
      };

      const html = generateLessonHtml(dataWithTenses);

      expect(html).toContain("Grammar Tenses Used");
      expect(html).toContain("Present Simple");
      expect(html).toContain("Present Continuous");
    });

    it("should include feedback sections when provided", () => {
      const dataWithFeedback = {
        ...baseLessonData,
        strengths: ["Good vocabulary usage"],
        improvements: ["Work on verb conjugation"],
        suggestions: ["Practice more with native speakers"],
      };

      const html = generateLessonHtml(dataWithFeedback);

      expect(html).toContain("Strengths");
      expect(html).toContain("Good vocabulary usage");
      expect(html).toContain("Areas for Improvement");
      expect(html).toContain("Work on verb conjugation");
      expect(html).toContain("Suggestions");
      expect(html).toContain("Practice more with native speakers");
    });

    it("should handle empty optional sections gracefully", () => {
      const minimalData = {
        ...baseLessonData,
        grammarMistakes: [],
        keyVocabulary: [],
        tenses: [],
        strengths: [],
        improvements: [],
        suggestions: [],
      };

      const html = generateLessonHtml(minimalData);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).not.toContain("Grammar Corrections");
      expect(html).not.toContain("Key Vocabulary");
      expect(html).not.toContain("Grammar Tenses Used");
      expect(html).not.toContain("Strengths");
    });

    it("should use corrected version in comparison", () => {
      const html = generateLessonHtml(baseLessonData);

      expect(html).toContain("Your Translation vs. Corrected Version");
      expect(html).toContain("Hola, ¿cómo está usted?");
    });

    it("should handle missing corrected version", () => {
      const dataWithoutCorrection = {
        ...baseLessonData,
        correctedVersion: undefined,
      };

      const html = generateLessonHtml(dataWithoutCorrection);

      expect(html).toContain("Your Translation vs. Corrected Version");
      expect(html).toContain("Hola, ¿cómo estás?"); // Should use user translation
    });

    it("should handle newlines in text", () => {
      const dataWithNewlines = {
        ...baseLessonData,
        originalText: "Line 1\nLine 2\nLine 3",
      };

      const html = generateLessonHtml(dataWithNewlines);

      expect(html).toContain("Line 1<br>Line 2<br>Line 3");
    });

    it("should apply correct score color based on performance", () => {
      const highScore = generateLessonHtml({ ...baseLessonData, score: 95 });
      const mediumScore = generateLessonHtml({ ...baseLessonData, score: 75 });
      const lowScore = generateLessonHtml({ ...baseLessonData, score: 45 });

      expect(highScore).toContain("#10b981"); // Green
      expect(mediumScore).toContain("#f59e0b"); // Yellow/Orange
      expect(lowScore).toContain("#ef4444"); // Red
    });

    it("should include footer with branding", () => {
      const html = generateLessonHtml(baseLessonData);

      expect(html).toContain("EasyEnglish Learning Textbook");
      expect(html).toContain("Keep up the great work!");
    });
  });
});
