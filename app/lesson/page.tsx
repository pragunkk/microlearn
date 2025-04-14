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
