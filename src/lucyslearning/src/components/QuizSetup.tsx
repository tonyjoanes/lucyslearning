import { useState } from 'react';
import OpenAI from 'openai';

interface QuizSetupProps {
  onQuestions: (questions: any[]) => void;
}

const QuizSetup = ({ onQuestions }: QuizSetupProps) => {
  const [theme, setTheme] = useState('');
  const [mathQuestions, setMathQuestions] = useState(10);
  const [grammarQuestions, setGrammarQuestions] = useState(10);
  const [keyStage, setKeyStage] = useState('ks3'); // default to KS3 for your son
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const generatePrompt = (theme: string, mathCount: number, grammarCount: number, stage: string) => {
    const ks2Prompt = `Create a UK Key Stage 2 (Year 5-6) quiz with ${mathCount} math questions and ${grammarCount} grammar questions. Theme: ${theme}.

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

    const ks3Prompt = `Create a UK Key Stage 3 (Year 7-9) quiz with ${mathCount} math questions and ${grammarCount} grammar questions. Theme: ${theme}.

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

    const basePrompt = stage === 'ks2' ? ks2Prompt : ks3Prompt;

    return `${basePrompt}

All questions should incorporate the ${theme} theme
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: `You are an expert teacher creating educational content for a ${keyStage === 'ks2' ? '10' : '13'}-year-old student. Create engaging questions that incorporate the given theme while maintaining educational value appropriate for ${keyStage.toUpperCase()}.`
        }, {
          role: "user",
          content: generatePrompt(theme, mathQuestions, grammarQuestions, keyStage)
        }],
        response_format: { type: "json_object" }
      });

      const generatedQuestions = JSON.parse(response.choices[0].message.content);
      
      if (generatedQuestions.questions) {
        onQuestions(generatedQuestions.questions);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-8 border border-blue-100">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Create Your Adventure!
        </h2>
        
        <div className="space-y-8">
          {/* Key Stage Selection */}
          <div>
            <label className="block text-lg font-medium mb-3 text-indigo-700">
              Choose Your Level
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setKeyStage('ks2')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  keyStage === 'ks2' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent shadow-lg' 
                    : 'bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400'
                }`}
              >
                Key Stage 2 
                <div className="text-sm opacity-75">Age 10-11</div>
              </button>
              <button
                onClick={() => setKeyStage('ks3')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  keyStage === 'ks3' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg' 
                    : 'bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400'
                }`}
              >
                Key Stage 3
                <div className="text-sm opacity-75">Age 11-14</div>
              </button>
            </div>
          </div>

          {/* Theme Input */}
          <div>
            <label className="block text-lg font-medium mb-3 text-indigo-700">
              Pick Your Theme
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="🚀 Space, 🌊 Ocean, 🦁 Animals..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-white text-gray-800 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-lg transition-all duration-200"
              />
            </div>
          </div>

          {/* Question Count Selectors */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-3 text-indigo-700">
                Math Questions
              </label>
              <select 
                value={mathQuestions}
                onChange={(e) => setMathQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer transition-all duration-200"
              >
                {[5, 10, 15, 20].map(count => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium mb-3 text-indigo-700">
                Grammar Questions
              </label>
              <select 
                value={grammarQuestions}
                onChange={(e) => setGrammarQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer transition-all duration-200"
              >
                {[5, 10, 15, 20].map(count => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!theme || isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isLoading ? 
              'Creating your adventure... ✨' : 
              'Start Your Quest! 🚀'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;