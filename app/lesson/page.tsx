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

  return (
    <div className="space-y-6 p-6 relative z-10 text-white min-h-screen">
      <h2 className="text-2xl font-bold">Today’s AI-Generated Lesson</h2>

      {loading && <p className="text-gray-300">Loading lesson...</p>}

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

      {/* Background Animation Layer */}
      <style jsx global>{`
        body {
          background: radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #3e93ff 15%, transparent 35%),
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #00bcd4 15%, transparent 35%),
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #9c27b0 15%, transparent 35%),
                      radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #e91e63 15%, transparent 35%),
                      radial-gradient(circle at ${gradientPosition.x - 5}% ${gradientPosition.y + 5}%, #4f6dff 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 15}% ${gradientPosition.y + 20}%, #00bcd4 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 30}% ${gradientPosition.y - 10}%, #9c27b0 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x - 25}% ${gradientPosition.y - 15}%, #e91e63 20%, transparent 40%),
                      radial-gradient(circle at ${gradientPosition.x + 50}% ${gradientPosition.y + 40}%, #3e93ff 20%, transparent 40%);
          background-size: 600% 600%;
          background-position: ${gradientPosition.x}% ${gradientPosition.y}%;
          background-blend-mode: overlay;
          transition: background-position 0.5s ease-out;
          animation: gradientAnimation 15s ease infinite;
          margin: 0;
          overflow-x: hidden;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%;
          }
          25% {
            background-position: 100% 50%, 25% 50%, 50% 50%, 75% 50%;
          }
          50% {
            background-position: 50% 100%, 25% 25%, 50% 25%, 75% 25%;
          }
          75% {
            background-position: 25% 75%, 25% 25%, 50% 75%, 75% 75%;
          }
          100% {
            background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%;
          }
        }
      `}</style>
    </div>
  );
}
