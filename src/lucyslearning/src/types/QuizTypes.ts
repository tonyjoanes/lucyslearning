export interface Question {
    type: 'math' | 'grammar';
    questionType: 'numeric' | 'text';
    question: string;
    correctAnswer: string | number;
    explanation: string;
    unit?: string;
  }
  
  export interface QuizPromptOptions {
    theme: string;
    mathCount: number;
    grammarCount: number;
    stage: 'ks2' | 'ks3';
  }