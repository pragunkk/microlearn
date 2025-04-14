'use client';

import { useState, useEffect } from 'react';

type QuizData = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function QuizPage() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const sensitivity = 0.3;
  const delay = 50;

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = ((clientX / innerWidth) * 100) * sensitivity;
    const y = ((clientY / innerHeight) * 100) * sensitivity;

    setTimeout(() => {
      setMousePosition({
        x: Math.min(Math.max(x, 0), 100),
        y: Math.min(Math.max(y, 0), 100),
      });
    }, delay);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    setGradientPosition(mousePosition);
  }, [mousePosition]);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswered(false);

    try {
      const res = await fetch("/api/lesson");
      if (!res.ok) throw new Error('Failed to fetch lesson');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setQuiz(data.quiz);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('There was an issue fetching the quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (option: string) => {
    if (!quiz || isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === quiz.correctAnswer) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer was: "${quiz.correctAnswer}"`);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  return (
    <div className="space-y-6 p-6 relative z-10 text-white min-h-screen">
      <h2 className="text-2xl font-bold">Today’s AI-Generated Quiz</h2>

      {error && <p className="text-red-400">{error}</p>}

      {quiz ? (
        <div className="bg-black/60 p-6 rounded-xl backdrop-blur-md text-gray-100 space-y-4 shadow-lg">
          <h4 className="text-lg">{quiz.question}</h4>
          <ul className="space-y-2">
            {quiz.options.map((option, idx) => (
              <li
                key={idx}
                className={`p-2 rounded-lg transition ${
                  selectedAnswer === option
                    ? option === quiz.correctAnswer
                      ? 'bg-green-700'
                      : 'bg-red-600'
                    : 'hover:bg-gray-700 cursor-pointer'
                } ${isAnswered && selectedAnswer !== option ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => handleAnswerClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
          {feedback && <p className="mt-4 text-sm text-gray-300">{feedback}</p>}
        </div>
      ) : (
        <p className="text-gray-400">Loading quiz...</p>
      )}

      {/* Background Animation Layer */}
      <style jsx global>{`
        body {
          background: radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #10002B 15%, transparent 35%), 
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #240046 15%, transparent 35%), 
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #3C096C 15%, transparent 35%), 
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #5A189A 15%, transparent 35%),
                      radial-gradient(circle at ${gradientPosition.x - 5}% ${gradientPosition.y + 5}%, #7B2CBF 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 15}% ${gradientPosition.y + 20}%, #9D4EDD 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 30}% ${gradientPosition.y - 10}%, #C77DFF 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x - 25}% ${gradientPosition.y - 15}%, #E0AAFF 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 50}% ${gradientPosition.y + 40}%, #10002B 20%, transparent 40%);
          background-size: 600% 600%, 600% 600%, 600% 600%, 600% 600%, 600% 600%, 600% 600%, 600% 600%, 600% 600%; /* Larger size for more expansive blobs */
          background-position: ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, 
                               ${gradientPosition.x - 5}% ${gradientPosition.y + 5}%, ${gradientPosition.x + 15}% ${gradientPosition.y + 20}%, 
                               ${gradientPosition.x + 30}% ${gradientPosition.y - 10}%, ${gradientPosition.x - 25}% ${gradientPosition.y - 15}%, 
                               ${gradientPosition.x + 50}% ${gradientPosition.y + 40}%;
          animation: gradientAnimation 15s ease infinite; /* Gradual background animation */
          transition: background-position 0.5s ease-out; /* Smooth transition */
          background-blend-mode: overlay; /* Blends the gradients together */
          height: 100vh;
          margin: 0;
          overflow: hidden;
          color: #fff;
        }

        /* Define the keyframes for the gradient animation */
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%;
          }
          25% {
            background-position: 100% 50%, 25% 50%, 50% 50%, 75% 50%, 100% 75%, 25% 75%, 50% 75%, 75% 75%, 100% 25%;
          }
          50% {
            background-position: 50% 100%, 25% 50%, 50% 50%, 75% 50%, 50% 25%, 25% 25%, 50% 25%, 75% 25%, 50% 75%;
          }
          75% {
            background-position: 25% 75%, 25% 50%, 50% 50%, 75% 50%, 25% 25%, 25% 75%, 50% 75%, 75% 75%, 25% 100%;
          }
          100% {
            background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%;
          }
        }
      `}</style>
    </div>
  );
}
