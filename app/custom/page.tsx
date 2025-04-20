'use client';

import { useEffect, useState } from 'react';

export default function CustomPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }> | null>(null);
  const [error, setError] = useState('');

  // per‑question interaction
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [answered, setAnswered] = useState<{ [key: number]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);

  // background animation state
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const sensitivity = 0.3;
  const delay = 50;

  // quirky loading phrases (≤15 chars)
  const loadingPhrases = [
    'Crunching txt',
    'Digesting...',
    'Summoning AI',
    'Spinning 🤖',
    'Brainstorm!',
    'Text Alchemy',
    'Brewing idea',
    'Shortening',
    'Magic bytes',
    'Synthesizing'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  // cycle phrases when loading
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (loading) {
      setPhraseIndex(0);
      iv = setInterval(() => {
        setPhraseIndex(i => (i + 1) % loadingPhrases.length);
      }, 800);
    }
    return () => clearInterval(iv);
  }, [loading]);

  // derive button label
  const buttonLabel = loading
    ? loadingPhrases[phraseIndex]
    : 'Generate Summary & Quiz';

  // glitch effect on button during loading
  const buttonClass = `btn-gradient hover:scale-105 ${loading ? 'glitch' : ''}`;

  // handle mouse‐move for background
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

  // keep body scrollable
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = orig; };
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setSummary('');
    setQuiz(null);
    setError('');
    setSelectedAnswers({});
    setAnswered({});
    setFeedback({});
    setScore(0);

    try {
      const res = await fetch('/api/custom-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
      setQuiz(data.quiz);
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (option: string, optionCode: string, idx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [idx]: optionCode }));
    setAnswered(prev => ({ ...prev, [idx]: true }));
    const correct = quiz?.[idx].correctAnswer === option;
    if (correct) setScore(s => s + 1);
    setFeedback(prev => ({
      ...prev,
      [idx]: correct
        ? 'Correct!'
        : `Wrong! The correct answer is ${quiz?.[idx].correctAnswer}.`
    }));
  };

  const allAnswered = quiz ? Object.keys(answered).length === quiz.length : false;

  return (
    <div className="p-6 text-white space-y-6 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-400">
        Custom Topic or Link Summary
      </h2>
      <p className="text-gray-300">
        Enter a topic or paste a link below. We'll generate a summary and a quiz.
      </p>

      {/* single-line neon input with Enter key support */}
      <div className="neon-input-wrapper w-full">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim() && !loading) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Type a topic or paste a URL..."
          className="neon-input w-full bg-transparent text-white rounded-full border-2 border-transparent px-4 py-2 focus:outline-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className={buttonClass}
      >
        {buttonLabel}
      </button>

      {error && <p className="text-red-400">{error}</p>}

      {summary && (
        <div className="bg-black/60 p-4 rounded-lg mt-6">
          <h3 className="text-purple-300 font-semibold mb-2">AI Summary</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {quiz && (
        <div className="bg-black/60 p-4 rounded-lg mt-6">
          <h3 className="text-green-300 font-semibold mb-4">Quiz Questions</h3>
          {quiz.map((q, idx) => {
            const isAns = Boolean(answered[idx]);
            const sel = selectedAnswers[idx] || '';
            return (
              <div key={idx} className="mb-6 space-y-2">
                <p className="text-gray-200 font-medium">{q.question}</p>
                <ul className="space-y-2">
                  {q.options.map((opt, i) => {
                    const code = String.fromCharCode(65 + i);
                    return (
                      <li
                        key={i}
                        onClick={() => !isAns && handleAnswerClick(opt, code, idx)}
                        className={`p-2 rounded-lg transition ${
                          isAns
                            ? opt === q.correctAnswer
                              ? 'bg-green-700'
                              : sel === code
                                ? 'bg-red-600'
                                : 'opacity-60 cursor-not-allowed'
                            : 'hover:bg-gray-700 cursor-pointer'
                        }`}
                      >
                        <span className="font-bold mr-2">{code}.</span> {opt}
                      </li>
                    );
                  })}
                </ul>
                {feedback[idx] && (
                  <p className="mt-2 text-sm text-gray-300">{feedback[idx]}</p>
                )}
              </div>
            );
          })}
          {allAnswered && (
            <div className="bg-black/60 p-4 rounded-lg mt-4 text-center">
              <p className="text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg">
                You scored {score} out of {quiz.length}!
              </p>
            </div>
          )}
        </div>
      )}

      {/* neon outline for input */}
      <style jsx>{`
        .neon-input-wrapper {
          position: relative;
          width: 100%;
        }
        .neon-input-wrapper::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          background: linear-gradient(45deg, #39ff14, #00ffff, #ff00ff);
          background-size: 200% 200%;
          animation: neon-border 3s linear infinite;
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          padding: 2px;
        }
        @keyframes neon-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* glitch effect */
        .glitch {
          position: relative;
          animation: glitch 1s infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 red; }
          20% { text-shadow: -2px 0 lime; }
          40% { text-shadow: 2px 0 cyan; }
          60% { text-shadow: -2px 0 magenta; }
          80% { text-shadow: 2px 0 yellow; }
          100% { text-shadow: -2px 0 white; }
        }
      `}</style>

      {/* background animation */}
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
          background-size: 600% 600%;
          background-position: ${gradientPosition.x}% ${gradientPosition.y}%;
          animation: gradientAnimation 15s ease infinite;
          transition: background-position 0.5s ease-out;
          background-blend-mode: overlay;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          color: #fff;
        }
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
