import { useState } from 'react';

interface QuizDisplayProps {
    questions: any[];
    onComplete: () => void;
    onReset: () => void;
}

const QuizDisplay = ({ questions, onComplete, onReset }: QuizDisplayProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState('');

    if (!questions || questions.length === 0) {
        return null;
    }

    const currentQuestion = questions[currentIndex];

    const renderGems = (count: number) => {
        return (
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
                <span className="text-sm font-medium text-indigo-700">Treasure Chest:</span>
                <div className="flex items-center">
                    {[...Array(count)].map((_, i) => (
                        <span
                            key={i}
                            className="text-xl transform hover:scale-110 transition-transform duration-200"
                            style={{
                                textShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                            }}
                        >
                            💎
                        </span>
                    ))}
                    {[...Array(questions.length - count)].map((_, i) => (
                        <span
                            key={i}
                            className="text-xl opacity-30"
                        >
                            💎
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const checkAnswer = () => {
        if (!currentAnswer.trim()) return;

        let isCorrect = false;
        const submittedAnswer = currentAnswer.trim();

        if (currentQuestion.questionType === 'numeric') {
            isCorrect = parseFloat(submittedAnswer) === parseFloat(currentQuestion.correctAnswer);
        } else {
            isCorrect = submittedAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        }

        const newAnswers = {
            ...userAnswers,
            [currentIndex]: {
                submitted: submittedAnswer,
                correct: isCorrect
            }
        };

        setUserAnswers(newAnswers);
        setShowExplanation(true);
    };

    const handleNext = () => {
        setShowExplanation(false);
        setCurrentAnswer('');
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    const correctAnswers = Object.values(userAnswers).filter(answer => answer.correct).length;

    return (
        <div className="mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border border-blue-100">
                {/* Header with progress and reset */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-medium text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl">
                        Wave {currentIndex + 1} of {questions.length}
                    </div>
                    <div className="flex items-center gap-4">
                        {renderGems(correctAnswers)}
                        <button
                            onClick={onReset}
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                        >
                            Start Over
                        </button>
                    </div>
                </div>

                {/* Question type indicator */}
                <div className="mb-4">
                    <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-xl ${currentQuestion.type === 'math'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        }`}>
                        {currentQuestion.type.toUpperCase()}
                    </span>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {currentQuestion.question}
                </h2>

                {/* Answer Input */}
                <div className="space-y-4">
                    <div>
                        <input
                            type={currentQuestion.questionType === 'numeric' ? 'number' : 'text'}
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            disabled={showExplanation}
                            placeholder={currentQuestion.questionType === 'numeric' ?
                                "Enter your numeric answer" :
                                "Type your answer here"}
                            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-white text-gray-800 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !showExplanation) {
                                    checkAnswer();
                                }
                            }}
                        />
                        {currentQuestion.unit && (
                            <span className="ml-2 text-indigo-600">{currentQuestion.unit}</span>
                        )}
                    </div>

                    {!showExplanation && (
                        <button
                            onClick={checkAnswer}
                            disabled={!currentAnswer.trim()}
                            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 disabled:opacity-50 transform transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                        >
                            Check Answer
                        </button>
                    )}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className={`mt-6 p-6 rounded-xl shadow-md ${userAnswers[currentIndex]?.correct
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
                            : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-100'
                        }`}>
                        <p className={`font-semibold mb-3 text-lg ${userAnswers[currentIndex]?.correct
                                ? 'text-green-800'  // Darker text for correct answers
                                : 'text-red-800'    // Darker text for incorrect answers
                            }`}>
                            {userAnswers[currentIndex]?.correct ?
                                '🌟 Brilliant! You got it right!' :
                                '💪 Keep going! You can do this!'}
                        </p>
                        {!userAnswers[currentIndex]?.correct && (
                            <p className="mb-3 text-gray-900 font-medium">  {/* Darker text for the correct answer */}
                                The correct answer is: {currentQuestion.correctAnswer}
                                {currentQuestion.unit ? ` ${currentQuestion.unit}` : ''}
                            </p>
                        )}
                        <p className="text-gray-800">{currentQuestion.explanation}</p>  {/* Darker text for explanation */}
                    </div>
                )}

                {/* Next button */}
                {showExplanation && (
                    <button
                        onClick={handleNext}
                        className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transform transition-all duration-200 hover:scale-[1.02]"
                    >
                        {currentIndex < questions.length - 1 ? 'Next Question →' : 'Complete Quest! 🎉'}
                    </button>
                )}

                {/* Quiz complete message */}
                {currentIndex === questions.length - 1 && showExplanation && (
                    <div className="mt-8 text-center p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                        <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                            Adventure Complete! 🎉
                        </h3>
                        <div className="mb-4">
                            {renderGems(correctAnswers)}
                        </div>
                        <p className="text-lg text-indigo-700 mb-4">
                            You collected {correctAnswers} {correctAnswers === 1 ? 'gem' : 'gems'} from the deep!
                            {correctAnswers === questions.length &&
                                " 🌟 Perfect treasure hunt! 🌟"}
                        </p>
                        {correctAnswers < questions.length && (
                            <p className="text-indigo-600">
                                Can you collect all {questions.length} gems on your next adventure?
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizDisplay;