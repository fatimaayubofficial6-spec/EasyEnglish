import React from "react";

export interface PdfLessonData {
  lessonNumber: number;
  title: string;
  originalText: string;
  userTranslation: string;
  correctedVersion?: string;
  score: number;
  completedAt: Date;
  difficulty: string;
  topics: string[];
  grammarMistakes?: Array<{
    mistake: string;
    correction: string;
    explanation: string;
  }>;
  keyVocabulary?: Array<{
    word: string;
    definition: string;
    example: string;
  }>;
  tenses?: string[];
  strengths?: string[];
  improvements?: string[];
  suggestions?: string[];
}

/**
 * Generate HTML string for a PDF lesson page
 * Uses inline styles for maximum PDF rendering compatibility
 */
export function generateLessonHtml(data: PdfLessonData): string {
  const {
    lessonNumber,
    title,
    originalText,
    userTranslation,
    correctedVersion,
    score,
    completedAt,
    difficulty,
    topics,
    grammarMistakes = [],
    keyVocabulary = [],
    tenses = [],
    strengths = [],
    improvements = [],
    suggestions = [],
  } = data;

  // Format date
  const formattedDate = new Date(completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Score color based on performance
  const scoreColor =
    score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : score >= 50 ? "#f97316" : "#ef4444";

  // Difficulty color
  const difficultyColors: Record<string, string> = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    advanced: "#ef4444",
  };
  const difficultyColor = difficultyColors[difficulty.toLowerCase()] || "#6b7280";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson ${lessonNumber}: ${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
      padding: 40px 50px;
    }
    
    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #8b5cf6;
    }
    
    .lesson-number {
      font-size: 14px;
      font-weight: 600;
      color: #8b5cf6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
    }
    
    .meta {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 11px;
      color: #6b7280;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    .badge-difficulty {
      background: ${difficultyColor}20;
      color: ${difficultyColor};
    }
    
    .badge-score {
      background: ${scoreColor}20;
      color: ${scoreColor};
    }
    
    .section {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .text-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    
    .text-box p {
      margin: 0;
      line-height: 1.7;
    }
    
    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .comparison-item {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
    }
    
    .comparison-label {
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .comparison-text {
      font-size: 11px;
      line-height: 1.6;
      color: #374151;
    }
    
    .mistake-card {
      background: #fef2f2;
      border-left: 3px solid #ef4444;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
    }
    
    .mistake-original {
      font-size: 11px;
      color: #dc2626;
      margin-bottom: 4px;
    }
    
    .mistake-correction {
      font-size: 11px;
      color: #059669;
      margin-bottom: 4px;
    }
    
    .mistake-explanation {
      font-size: 10px;
      color: #6b7280;
      font-style: italic;
    }
    
    .vocab-card {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
    }
    
    .vocab-word {
      font-size: 12px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 4px;
    }
    
    .vocab-definition {
      font-size: 11px;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .vocab-example {
      font-size: 10px;
      color: #6b7280;
      font-style: italic;
    }
    
    .feedback-list {
      list-style: none;
      padding: 0;
    }
    
    .feedback-item {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 6px;
      font-size: 11px;
    }
    
    .feedback-item.strength {
      background: #f0fdf4;
      border-left: 3px solid #10b981;
      color: #065f46;
    }
    
    .feedback-item.improvement {
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      color: #92400e;
    }
    
    .feedback-item.suggestion {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
      color: #1e40af;
    }
    
    .tense-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .tense-tag {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 10px;
      font-weight: 600;
      color: #374151;
    }
    
    .topic-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .topic-tag {
      background: #ede9fe;
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 10px;
      font-weight: 600;
      color: #7c3aed;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
    }
    
    @media print {
      body {
        padding: 30px 40px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="lesson-number">Lesson ${lessonNumber}</div>
    <h1 class="title">${escapeHtml(title)}</h1>
    <div class="meta">
      <div class="meta-item">
        <span>📅 ${formattedDate}</span>
      </div>
      <div class="meta-item">
        <span class="badge badge-difficulty">${difficulty}</span>
      </div>
      <div class="meta-item">
        <span class="badge badge-score">Score: ${score}%</span>
      </div>
    </div>
    ${topics.length > 0 ? `<div class="topic-tags">${topics.map((topic) => `<span class="topic-tag">${escapeHtml(topic)}</span>`).join("")}</div>` : ""}
  </div>

  <div class="section">
    <h2 class="section-title">Original Text</h2>
    <div class="text-box">
      <p>${escapeHtml(originalText).replace(/\n/g, "<br>")}</p>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Your Translation vs. Corrected Version</h2>
    <div class="comparison">
      <div class="comparison-item">
        <div class="comparison-label">Your Translation</div>
        <div class="comparison-text">${escapeHtml(userTranslation).replace(/\n/g, "<br>")}</div>
      </div>
      <div class="comparison-item">
        <div class="comparison-label">Corrected Version</div>
        <div class="comparison-text">${escapeHtml(correctedVersion || userTranslation).replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>

  ${grammarMistakes.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Grammar Corrections (${grammarMistakes.length})</h2>
    ${grammarMistakes
      .map(
        (mistake) => `
      <div class="mistake-card">
        <div class="mistake-original">❌ ${escapeHtml(mistake.mistake)}</div>
        <div class="mistake-correction">✅ ${escapeHtml(mistake.correction)}</div>
        <div class="mistake-explanation">${escapeHtml(mistake.explanation)}</div>
      </div>
    `
      )
      .join("")}
  </div>
  ` : ""}

  ${tenses.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Grammar Tenses Used</h2>
    <div class="tense-tags">
      ${tenses.map((tense) => `<span class="tense-tag">${escapeHtml(tense)}</span>`).join("")}
    </div>
  </div>
  ` : ""}

  ${keyVocabulary.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Key Vocabulary (${keyVocabulary.length})</h2>
    ${keyVocabulary
      .map(
        (vocab) => `
      <div class="vocab-card">
        <div class="vocab-word">${escapeHtml(vocab.word)}</div>
        <div class="vocab-definition">${escapeHtml(vocab.definition)}</div>
        <div class="vocab-example">"${escapeHtml(vocab.example)}"</div>
      </div>
    `
      )
      .join("")}
  </div>
  ` : ""}

  ${strengths.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Strengths</h2>
    <ul class="feedback-list">
      ${strengths.map((item) => `<li class="feedback-item strength">✨ ${escapeHtml(item)}</li>`).join("")}
    </ul>
  </div>
  ` : ""}

  ${improvements.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Areas for Improvement</h2>
    <ul class="feedback-list">
      ${improvements.map((item) => `<li class="feedback-item improvement">💡 ${escapeHtml(item)}</li>`).join("")}
    </ul>
  </div>
  ` : ""}

  ${suggestions.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Suggestions</h2>
    <ul class="feedback-list">
      ${suggestions.map((item) => `<li class="feedback-item suggestion">💡 ${escapeHtml(item)}</li>`).join("")}
    </ul>
  </div>
  ` : ""}

  <div class="footer">
    <p>EasyEnglish Learning Textbook • Generated on ${new Date().toLocaleDateString()}</p>
    <p>Keep up the great work! 🎉</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
