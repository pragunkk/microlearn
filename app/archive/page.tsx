'use client';

import { useState, useEffect } from 'react';

type Lesson = {
  topic: string;
  date: string;
  summary: string;
};

export default function ArchivePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

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

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch('/api/archive');
        const data = await res.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching archive:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const closeModal = () => setSelectedLesson(null);

  return (
    <div className="space-y-6 p-6 text-white min-h-screen relative z-10">
      <h2 className="text-2xl font-bold">Lesson Archive</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-400">No archived lessons available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded-xl space-y-2 cursor-pointer hover:bg-gray-800 transition"
              onClick={() => setSelectedLesson(lesson)}
            >
              <h3 className="font-semibold text-blue-400">{lesson.topic}</h3>
              <p className="text-sm text-gray-400">Date: {lesson.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl relative text-white">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedLesson.topic}</h3>
            <p className="text-sm text-gray-400 mb-4">Date: {selectedLesson.date}</p>
            <p className="whitespace-pre-wrap text-gray-200">{selectedLesson.summary}</p>
          </div>
        </div>
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
          padding-bottom: 10vh;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%; }
          25% { background-position: 100% 50%, 25% 50%, 50% 50%, 75% 50%, 100% 75%, 25% 75%, 50% 75%, 75% 75%, 100% 25%; }
          50% { background-position: 50% 100%, 25% 50%, 50% 50%, 75% 50%, 50% 25%, 25% 25%, 50% 25%, 75% 25%, 50% 75%; }
          75% { background-position: 25% 75%, 25% 50%, 50% 50%, 75% 50%, 25% 25%, 25% 75%, 50% 75%, 75% 75%, 25% 100%; }
          100% { background-position: 0% 50%, 25% 50%, 50% 50%, 75% 50%, 0% 75%, 25% 75%, 50% 75%, 75% 75%, 0% 25%; }
        }
      `}</style>
    </div>
  );
}
