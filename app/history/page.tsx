'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js 13+

type LessonHistory = {
  topic: string;
  date: string;
  score?: number;
};

export default function HistoryPage() {
  const { isSignedIn } = useUser(); // Check if the user is signed in
  const router = useRouter();

  // If user is not signed in, redirect them to the login page
  if (!isSignedIn) {
    router.push('/sign-in'); // Assuming /sign-in is your login page
    return <p>Redirecting to login...</p>;
  }

  const [history, setHistory] = useState<LessonHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Lesson History</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400">No history available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((entry, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-xl space-y-1">
              <h3 className="font-semibold text-white">{entry.topic}</h3>
              <p className="text-sm text-gray-400">Date: {entry.date}</p>
              <p className="text-sm text-gray-400">
                Score: {entry.score !== undefined ? `${entry.score}/3` : "Not Attempted"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
