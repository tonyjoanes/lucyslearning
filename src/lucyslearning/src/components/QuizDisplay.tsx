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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header with progress and reset */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Score: {correctAnswers}/{Object.keys(userAnswers).length}
            </span>
            <button
              onClick={onReset}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Question type indicator */}
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded ${
            currentQuestion.type === 'math' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {currentQuestion.type.toUpperCase()}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold mb-6 text-gray-800">
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
              className="w-full p-3 border rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showExplanation) {
                  checkAnswer();
                }
              }}
            />
            {currentQuestion.unit && (
              <span className="ml-2 text-gray-700">{currentQuestion.unit}</span>
            )}
          </div>

          {!showExplanation && (
            <button
              onClick={checkAnswer}
              disabled={!currentAnswer.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              Check Answer
            </button>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mt-4 p-4 rounded-md ${
            userAnswers[currentIndex]?.correct 
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium mb-2">
              {userAnswers[currentIndex]?.correct ? 'Correct!' : 'Not quite right.'}
            </p>
            <p className="mb-2">
              {!userAnswers[currentIndex]?.correct && (
                <span>The correct answer is: {currentQuestion.correctAnswer}
                  {currentQuestion.unit ? ` ${currentQuestion.unit}` : ''}
                </span>
              )}
            </p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;