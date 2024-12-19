import { QuizPromptOptions } from '../types/QuizTypes';

const ks2Prompt = (options: QuizPromptOptions) => `
Create a UK Key Stage 2 (Year 5-6) quiz with ${options.mathCount} math questions and ${options.grammarCount} grammar questions. Theme: ${options.theme}.

Requirements for KS2:
- Math questions should be a mix of:
  * Calculation questions requiring numeric answers
  * Standard long division and long multiplication questions
  * Word problems requiring numeric answers
  * Questions about fractions, decimals, and percentages
- Grammar questions should focus on:
  * Using commas in complex sentences
  * Using apostrophes correctly
  * Basic sentence structure
  * Word types (nouns, verbs, adjectives, adverbs)`;

const ks3Prompt = (options: QuizPromptOptions) => `
Create a UK Key Stage 3 (Year 7-9) quiz with ${options.mathCount} math questions and ${options.grammarCount} grammar questions. Theme: ${options.theme}.

Requirements for KS3:
- Math questions should be a mix of:
  * Algebra and equations
  * Geometry and measurements
  * Statistics and probability
  * More complex word problems
  * Questions involving negative numbers and indices
- Grammar questions should focus on:
  * Advanced punctuation usage
  * Complex sentence structures
  * Active and passive voice
  * More sophisticated vocabulary
  * Writing techniques and effects`;

export const generatePrompt = (options: QuizPromptOptions) => {
  const basePrompt = options.stage === 'ks2' ? ks2Prompt(options) : ks3Prompt(options);

  return `${basePrompt}

All questions should incorporate the ${options.theme} theme
Return a JSON object with this exact structure:
{
  "questions": [{
    "type": "math" | "grammar",
    "questionType": "numeric" | "text",
    "question": "question text",
    "correctAnswer": "answer" (string for text, number for numeric),
    "explanation": "explanation of the answer",
    "unit": "optional unit for numeric answers (e.g., meters, seconds)"
  }]
}`;
};

export const getSystemPrompt = (stage: 'ks2' | 'ks3') => 
  `You are an expert teacher creating educational content for a ${stage === 'ks2' ? '10' : '13'}-year-old student. Create engaging questions that incorporate the given theme while maintaining educational value appropriate for ${stage.toUpperCase()}.`;