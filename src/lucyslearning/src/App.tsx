import { useState } from 'react';
import QuizSetup from './components/QuizSetup';
import QuizDisplay from './components/QuizDisplay';

function App() {
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleReset = () => {
    setQuestions(null);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-start py-8">
      <div className="container mx-auto px-4 max-w-5xl">

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Lucy's Learning Quiz</h1>

        <div className="max-w-3xl mx-auto">
          {!questions && (
            <QuizSetup onQuestions={setQuestions} />
          )}
          {questions && !quizCompleted && (
            <QuizDisplay
              questions={questions}
              onComplete={() => setQuizCompleted(true)}
              onReset={handleReset}
            />
          )}
          {quizCompleted && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
              <button
                onClick={handleReset}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
              >
                Start New Quiz
              </button>
            </div>
          )}
        </div>
      </div></div>
  );
}

export default App;