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
  const [isAnswered, setIsAnswered] = useState(false); // Freeze control

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswered(false); // Reset freeze state

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
    if (!quiz || isAnswered) return; // Prevent answering more than once

    setSelectedAnswer(option);
    setIsAnswered(true); // Freeze the quiz

    if (option === quiz.correctAnswer) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer was: "${quiz.correctAnswer}"`);
    }
  };

  useEffect(() => {
    fetchQuiz(); // Auto-fetch quiz when the page loads
  }, []);

  return (
    <div className="space-y-6 bg-gradient min-h-screen p-6"> {/* Apply the gradient background here */}
      <h2 className="text-2xl font-bold text-white">Today’s AI-Generated Quiz</h2>

      {error && <p className="text-red-500">{error}</p>}

      {quiz ? (
        <div className="bg-gray-900 p-6 rounded-xl text-gray-100 space-y-4 shadow-lg">
          <h4 className="text-lg text-white">{quiz.question}</h4>
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
        <p className="text-gray-400">Loading quiz...</p> // Display a loading message
      )}
    </div>
  );
}
