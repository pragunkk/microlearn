'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const sensitivity = 0.3; // Reduced sensitivity for slower mouse movement effect
  const delay = 50; // Delay in ms for smoother transition

  // Debounced mouse move handler with slight delay
  const handleMouseMove = (event: MouseEvent) => {
    const { clientX: mouseX, clientY: mouseY } = event;
    const { innerWidth, innerHeight } = window;

    // Calculate new position but apply reduced sensitivity
    const x = ((mouseX / innerWidth) * 100) * sensitivity;
    const y = ((mouseY / innerHeight) * 100) * sensitivity;

    // Introduce delay using setTimeout
    setTimeout(() => {
      setMousePosition({
        x: Math.min(Math.max(x, 0), 100),
        y: Math.min(Math.max(y, 0), 100),
      });
    }, delay);
  };

  useEffect(() => {
    // Add the mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Update gradient position with some delay for smooth effect
    setGradientPosition(mousePosition);
  }, [mousePosition]);

  return (
    <div className="space-y-8 text-center">
      <h2 className="text-3xl font-semibold">Ready to learn something new today?</h2>
      <a href="/lesson">
        <button className="btn-gradient hover:scale-105">
          Today's Lesson
        </button>
      </a>

      {/* Apply dynamic blob-like gradient position based on mouse movement */}
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
