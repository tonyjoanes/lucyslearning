import { useState } from 'react';
import OpenAI from 'openai';
import LoadingSpinner from './LoadingSpinner';


interface QuizSetupProps {
    onQuestions: (questions: any[]) => void;
}

const QuizSetup = ({ onQuestions }: QuizSetupProps) => {
    const [theme, setTheme] = useState('');
    const [mathQuestions, setMathQuestions] = useState(10);
    const [grammarQuestions, setGrammarQuestions] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const generatePrompt = (theme: string, mathCount: number, grammarCount: number) => {
        return `Create a UK Key Stage 2 (KS2) quiz with ${mathCount} math questions and ${grammarCount} grammar questions. Theme: ${theme}.

Requirements:
- Math questions should be a mix of:
  * Calculation questions requiring numeric answers (e.g., "If a dolphin swims 15 meters per second, how far will it swim in 3 seconds?")
  * Standard long division and long multiplication questions
  * Word problems requiring numeric answers
- Grammar questions should require text answers, such as:
  * Fill in the missing word
  * Correct the sentence
  * Complete the sentence
  * Include punctuation
  * Using modal verbs (might, should, will, must)
  * Using relative clauses starting with who, which, where, when, whose, that
  * Identifying and using different word classes (nouns, verbs, adjectives, adverbs)
  * Using prefixes correctly
- All questions should incorporate the ${theme} theme
- Return a JSON object with this exact structure:
{
  "questions": [{
    "type": "math",
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
                    content: "You are an expert teacher creating educational content for a 10-year-old student. Create engaging questions that incorporate the given theme while maintaining educational value."
                }, {
                    role: "user",
                    content: generatePrompt(theme, mathQuestions, grammarQuestions)
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
        <>
            {isLoading && <LoadingSpinner />}

            <div className="max-w-2xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Quiz</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Choose your theme (e.g., Ocean, Animals, Space)
                            </label>
                            <input
                                type="text"
                                placeholder="Enter a fun theme for your quiz"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Math Questions
                                </label>
                                <select
                                    value={mathQuestions}
                                    onChange={(e) => setMathQuestions(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {[5, 10, 15, 20].map(count => (
                                        <option key={count} value={count}>
                                            {count} questions
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Grammar Questions
                                </label>
                                <select
                                    value={grammarQuestions}
                                    onChange={(e) => setGrammarQuestions(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            Generate Quiz
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizSetup;