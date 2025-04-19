'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LessonData = {
  topic: string;
  summary: string;
};

export default function LessonPage() {
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lesson");
      if (!res.ok) throw new Error('Failed to fetch lesson');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLesson(data);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError('There was an issue fetching the lesson. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, []);

  const loadingMessages = [
    "Learning new things...",
    "Summarizing knowledge...",
    "Training the AI brain...",
    "Gathering facts...",
    "Making a lesson just for you...",
    "Getting smarter every second...",
    "Cooking up some knowledge...",
    "Almost there, hang tight!",
    "Compiling wisdom...",
    "Charging neurons ⚡️",
    "Reticulating splines...",
    "Whispering to Wikipedia...",
    "Consulting the ancient scrolls 📜",
    "Decrypting educational secrets...",
    "Polishing up some facts ✨",
    "Syncing with the data cloud ☁️",
    "Optimizing your brain’s download...",
    "Brewing intellectual coffee ☕️",
    "Upgrading your curiosity...",
    "Teleporting knowledge through space-time...",
    "Installing today's dose of smart 🤓",
    "Debugging reality...",
    "Warming up the quantum servers 🧠",
    "Fetching fun from the knowledge multiverse 🌌",
    "Dusting off AI textbooks...",
    "Rewriting history in 5 lines or less...",
    "Shuffling the trivia deck 🃏",
    "Crunching numbers and noodles 🍜",
    "Casting Level 5 Summarize!",
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(() =>
    Math.floor(Math.random() * loadingMessages.length)
  );
  const [initialMessageSet, setInitialMessageSet] = useState(false);

  useEffect(() => {
    if (!loading) {
      setInitialMessageSet(false);
      return;
    }

    if (!initialMessageSet) {
      setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));
      setInitialMessageSet(true);
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, initialMessageSet]);

  return (
    <div className="space-y-6 p-6 relative z-10 text-white min-h-screen">
      <h2 className="text-2xl font-bold">Today’s Lesson</h2>

      {loading && (
        <p
          key={loadingMessageIndex}
          className="text-purple-300 italic text-lg glitch-animation"
        >
          {loadingMessages[loadingMessageIndex]}
        </p>
      )}

      {error && <p className="text-red-400">{error}</p>}

      {lesson ? (
        <div className="bg-black/60 p-6 rounded-xl backdrop-blur-md text-gray-100 space-y-4 relative z-10">
          <h3 className="text-xl font-semibold text-blue-400">{lesson.topic}</h3>
          <p className="whitespace-pre-wrap">{lesson.summary}</p>

          <button
            onClick={() => router.push('/quiz')}
            className="btn-gradient hover:scale-105"
          >
            Take Quiz
          </button>
        </div>
      ) : (
        !loading && <p className="text-gray-300">No lesson available at the moment.</p>
      )}

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
          background-position: ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, ${gradientPosition.x}% ${gradientPosition.y}%, 
                               ${gradientPosition.x - 5}% ${gradientPosition.y + 5}%, ${gradientPosition.x + 15}% ${gradientPosition.y + 20}%, 
                               ${gradientPosition.x + 30}% ${gradientPosition.y - 10}%, ${gradientPosition.x - 25}% ${gradientPosition.y - 15}%, 
                               ${gradientPosition.x + 50}% ${gradientPosition.y + 40}%;
          animation: gradientAnimation 15s ease infinite;
          transition: background-position 0.5s ease-out;
          background-blend-mode: overlay;
          color: #fff;
          overflow: auto;
          padding-bottom: 10vh; /* Prevents content from being hidden at the bottom */
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%; }
          25% { background-position: 100% 50%, 25% 50%, 50% 50%, 75% 50%, 100% 75%, 25% 75%, 50% 75%, 75% 75%, 100% 25%; }
          50% { background-position: 50% 100%, 25% 50%, 50% 50%, 75% 50%, 50% 25%, 25% 25%, 50% 25%, 75% 25%, 50% 75%; }
          75% { background-position: 25% 75%, 25% 50%, 50% 50%, 75% 50%, 25% 25%, 25% 75%, 50% 75%, 75% 75%, 25% 100%; }
          100% { background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%; }
        }

        @keyframes glitch {
          0% { transform: translate(0); opacity: 1; }
          20% { transform: translate(-2px, 2px) skew(-5deg); opacity: 0.8; }
          40% { transform: translate(2px, -1px) skew(5deg); opacity: 0.9; }
          60% { transform: translate(-1px, 1px) skew(-3deg); opacity: 0.85; }
          80% { transform: translate(1px, -2px) skew(3deg); opacity: 0.95; }
          100% { transform: translate(0); opacity: 1; }
        }

        .glitch-animation {
          animation: glitch 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
