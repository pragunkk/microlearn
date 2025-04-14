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
    fetchLesson(); // Automatically fetch the lesson when the page loads
  }, []);

  return (
    <div className="space-y-6 bg-gradient min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white">Today’s AI-Generated Lesson</h2>

      {loading && <p className="text-gray-400">Loading lesson...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {lesson ? (
        <div className="bg-gray-900 p-6 rounded-xl text-gray-100 space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">{lesson.topic}</h3>
          <p className="whitespace-pre-wrap">{lesson.summary}</p>

          {/* ✅ Take Quiz button with gradient */}
          <button
            onClick={() => router.push('/quiz')}
            className="btn-gradient hover:scale-105"
          >
            Take Quiz
          </button>
        </div>
      ) : (
        !loading && <p className="text-gray-400">No lesson available at the moment.</p>
      )}
    </div>
  );
}
