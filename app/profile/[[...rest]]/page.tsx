'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
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

  return (
    <div className="flex justify-center pt-10 min-h-screen text-white relative z-10">
      <UserProfile />

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
