import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuration
const getApiKey = () => process.env.GEMINI_API_KEY || "";
export const isGeminiConfigured = () => !!getApiKey();

// Lazy initialization of Gemini client
let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI | null {
  if (!getApiKey()) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getApiKey());
  }
  return genAI;
}

// Configuration
const TRANSLATION_MODEL = "gemini-1.5-flash";
const FEEDBACK_MODEL = "gemini-1.5-pro";
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
}

interface FeedbackResult {
  success: boolean;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    overallFeedback: string;
    correctedVersion?: string;
    grammarMistakes?: Array<{
      mistake: string;
      correction: string;
      explanation: string;
    }>;
    tenses?: string[];
    keyVocabulary?: Array<{
      word: string;
      definition: string;
      example: string;
    }>;
  };
  error?: string;
}

// Helper function to implement exponential backoff retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    const isRateLimitError =
      error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("rate limit") ||
        error.message.includes("quota"));

    if (!isRateLimitError && retries < MAX_RETRIES) {
      throw error;
    }

    console.log(`Retrying after ${delay}ms... (${retries} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Helper function to add timeout to promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
}

/**
 * Translate text from source language to target language using Gemini
 * @param text - Text to translate
 * @param sourceLang - Source language code (e.g., 'en')
 * @param targetLang - Target language code (e.g., 'es')
 * @param targetLangName - Human-readable target language name (e.g., 'Spanish')
 * @returns Translation result with success flag and translated text
 */
export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  targetLangName?: string
): Promise<TranslationResult> {
  const client = getGenAI();
  if (!client) {
    console.error("Gemini API not configured");
    return {
      success: false,
      error: "Translation service not configured",
    };
  }

  try {
    const model = client.getGenerativeModel({ model: TRANSLATION_MODEL });

    const targetLanguage = targetLangName || targetLang;
    const prompt = `Translate the following text from ${sourceLang} to ${targetLanguage}. Provide only the translation without any explanations or additional text.

Text to translate:
${text}`;

    const result = await retryWithBackoff(() =>
      withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT)
    );

    const response = await result.response;
    const translation = response.text().trim();

    if (!translation) {
      return {
        success: false,
        error: "Empty translation received",
      };
    }

    console.log(`Translation successful: ${sourceLang} -> ${targetLang}`);
    return {
      success: true,
      translation,
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Translation failed",
    };
  }
}

/**
 * Generate AI feedback for exercise submission using Gemini
 * @param exerciseType - Type of exercise (translation, gap_fill, etc.)
 * @param originalText - Original paragraph text
 * @param userAnswer - User's submitted answer
 * @param correctAnswer - Optional correct answer for comparison
 * @returns Feedback result with score and detailed analysis
 */
export async function generateFeedback(
  exerciseType: string,
  originalText: string,
  userAnswer: string,
  correctAnswer?: string
): Promise<FeedbackResult> {
  const client = getGenAI();
  if (!client) {
    console.error("Gemini API not configured");
    return {
      success: false,
      error: "AI feedback service not configured",
    };
  }

  try {
    const model = client.getGenerativeModel({ model: FEEDBACK_MODEL });

    const prompt = buildFeedbackPrompt(exerciseType, originalText, userAnswer, correctAnswer);

    const result = await retryWithBackoff(() =>
      withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT)
    );

    const response = await result.response;
    const feedbackText = response.text().trim();

    // Parse the structured feedback from the response
    const feedback = parseFeedbackResponse(feedbackText);

    console.log(`Feedback generated successfully for ${exerciseType} exercise`);
    return {
      success: true,
      feedback,
    };
  } catch (error) {
    console.error("Feedback generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Feedback generation failed",
    };
  }
}

/**
 * Build feedback prompt based on exercise type
 */
function buildFeedbackPrompt(
  exerciseType: string,
  originalText: string,
  userAnswer: string,
  correctAnswer?: string
): string {
  let prompt = "";

  switch (exerciseType) {
    case "translation":
      prompt = `You are an English language teacher evaluating a student's translation exercise.

Original Text:
${originalText}

Student's Translation:
${userAnswer}

${correctAnswer ? `Reference Translation:\n${correctAnswer}\n` : ""}

Please provide detailed feedback in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-3 specific strengths in the translation>],
  "improvements": [<array of 2-3 specific areas that need improvement>],
  "suggestions": [<array of 2-3 actionable suggestions for better translation>],
  "overallFeedback": "<brief 2-3 sentence summary of the translation quality>",
  "correctedVersion": "<the corrected/improved version of the student's translation>",
  "grammarMistakes": [
    {
      "mistake": "<specific mistake from student's text>",
      "correction": "<corrected version>",
      "explanation": "<brief explanation of the grammar rule>"
    }
  ],
  "tenses": [<array of key tenses used or needed in the translation, e.g., "Present Simple", "Past Perfect">],
  "keyVocabulary": [
    {
      "word": "<important vocabulary word from the text>",
      "definition": "<simple definition>",
      "example": "<example sentence using the word>"
    }
  ]
}

Evaluate based on:
- Accuracy of meaning
- Natural language flow
- Grammar and vocabulary
- Context preservation

Respond ONLY with valid JSON, no additional text.`;
      break;

    case "gap_fill":
      prompt = `You are an English language teacher evaluating a student's gap-fill exercise.

Original Text with Gaps:
${originalText}

Student's Answer:
${userAnswer}

${correctAnswer ? `Correct Answer:\n${correctAnswer}\n` : ""}

Please provide detailed feedback in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-3 specific strengths>],
  "improvements": [<array of 2-3 specific areas that need improvement>],
  "suggestions": [<array of 2-3 actionable suggestions>],
  "overallFeedback": "<brief 2-3 sentence summary>"
}

Evaluate based on:
- Correctness of filled words
- Grammar and context appropriateness
- Vocabulary choice

Respond ONLY with valid JSON, no additional text.`;
      break;

    case "rewrite":
      prompt = `You are an English language teacher evaluating a student's text rewriting exercise.

Original Text:
${originalText}

Student's Rewrite:
${userAnswer}

Please provide detailed feedback in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-3 specific strengths in the rewrite>],
  "improvements": [<array of 2-3 specific areas that need improvement>],
  "suggestions": [<array of 2-3 actionable suggestions>],
  "overallFeedback": "<brief 2-3 sentence summary>"
}

Evaluate based on:
- Preservation of original meaning
- Improved clarity and style
- Grammar and vocabulary enhancement
- Natural English flow

Respond ONLY with valid JSON, no additional text.`;
      break;

    case "comprehension":
      prompt = `You are an English language teacher evaluating a student's comprehension exercise.

Text:
${originalText}

Student's Answer:
${userAnswer}

${correctAnswer ? `Model Answer:\n${correctAnswer}\n` : ""}

Please provide detailed feedback in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-3 specific strengths in understanding>],
  "improvements": [<array of 2-3 areas where understanding could improve>],
  "suggestions": [<array of 2-3 actionable suggestions>],
  "overallFeedback": "<brief 2-3 sentence summary>"
}

Evaluate based on:
- Accuracy of comprehension
- Depth of understanding
- Relevance to question
- Clarity of expression

Respond ONLY with valid JSON, no additional text.`;
      break;

    default:
      prompt = `You are an English language teacher providing feedback on a student's exercise.

Exercise:
${originalText}

Student's Answer:
${userAnswer}

Please provide detailed feedback in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-3 specific strengths>],
  "improvements": [<array of 2-3 specific areas that need improvement>],
  "suggestions": [<array of 2-3 actionable suggestions>],
  "overallFeedback": "<brief 2-3 sentence summary>"
}

Respond ONLY with valid JSON, no additional text.`;
  }

  return prompt;
}

/**
 * Parse feedback response from Gemini
 */
function parseFeedbackResponse(responseText: string): {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  overallFeedback: string;
  correctedVersion?: string;
  grammarMistakes?: Array<{
    mistake: string;
    correction: string;
    explanation: string;
  }>;
  tenses?: string[];
  keyVocabulary?: Array<{
    word: string;
    definition: string;
    example: string;
  }>;
} {
  try {
    // Try to extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and return with defaults
    return {
      score: Math.min(100, Math.max(0, parsed.score || 0)),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      overallFeedback: parsed.overallFeedback || "Good effort!",
      correctedVersion: parsed.correctedVersion,
      grammarMistakes: Array.isArray(parsed.grammarMistakes) ? parsed.grammarMistakes : [],
      tenses: Array.isArray(parsed.tenses) ? parsed.tenses : [],
      keyVocabulary: Array.isArray(parsed.keyVocabulary) ? parsed.keyVocabulary : [],
    };
  } catch (error) {
    console.error("Failed to parse feedback response:", error);
    // Return default feedback if parsing fails
    return {
      score: 50,
      strengths: ["You completed the exercise"],
      improvements: ["Continue practicing"],
      suggestions: ["Review the material and try again"],
      overallFeedback: "Thank you for completing this exercise. Keep practicing!",
    };
  }
}
