'use client';
import React, { useState, useEffect } from 'react';

export default function HomePage() {
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
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setGradientPosition(mousePosition);
  }, [mousePosition]);

  // *** CHANGE 1: Define Navbar Height (adjust '4rem' as needed) ***
  // You could also pass this as a prop or use a CSS variable if preferred.
  const navBarHeight = '4rem'; // Example: Corresponds to h-16 in Tailwind

  return (
    // *** CHANGE 2: Adjust main container height calculation if needed ***
    // The original `h-screen` on the container might be okay if the navbar is truly
    // sticky *outside* this component's render tree. If this component's container
    // itself needs to be offset, you might apply min-height here instead of on sections.
    // For now, we focus on centering within sections assuming the container scrolls correctly.
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar">
      {/* First Section with CTA */}
      <section
        // *** CHANGE 3: Adjust section height ***
        // Use calc() to subtract the navbar height from the viewport height.
        // Ensure flex centering works within this new height.
        className={`snap-start w-full flex flex-col items-center justify-center text-center text-white opacity-0 animate-fade-in-on-scroll px-4`}
        style={{ height: `calc(100vh - ${navBarHeight})` }} // Use calculated height
      >
        <div className="max-w-3xl w-full mx-auto">
          <h1 className="text-5xl font-bold mb-8">
            Ready to learn something new today?
          </h1>
          <a href="/lesson">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full shadow-md transition-transform transform hover:scale-105">
              Today's Lesson
            </button>
          </a>
        </div>
      </section>

      {/* Remaining Sections */}
      {[
        {
          title: 'Why MicroLearn?',
          content:
            'In a world overloaded with information and distractions, learning effectively can feel overwhelming. MicroLearn is here to change that.',
        },
        {
          title: '🚀 Bite-sized learning',
          content:
            'We deliver concise, high-impact lessons daily, so you can absorb knowledge in minutes — not hours.',
        },
        {
          title: '🧠 Built for your brain',
          content:
            'Short learning sessions are proven to improve focus, retention, and motivation. MicroLearn taps into this, helping you build real understanding over time without burnout.',
        },
        {
          title: '🌍 Relevant & Real-time',
          content:
            'Powered by AI and current data, each lesson is tailored to what matters now — keeping you informed about trending topics and essential concepts.',
        },
        {
          title: '💡 Learn more, stress less',
          content:
            "Whether you're on a break, commuting, or winding down — MicroLearn fits seamlessly into your day. No pressure, no clutter — just learning that sticks.",
        },
      ].map((section, index) => (
        <section
          key={index}
          // *** CHANGE 4: Apply same height adjustment to all sections ***
          className={`snap-start w-full flex flex-col items-center justify-center text-center text-white opacity-0 animate-fade-in-on-scroll px-4`}
          style={{ height: `calc(100vh - ${navBarHeight})` }} // Use calculated height
        >
          <div className="max-w-3xl w-full mx-auto">
            <h2 className="text-4xl font-bold mb-6">{section.title}</h2>
            <p className="text-lg">{section.content}</p>
          </div>
        </section>
      ))}

      {/* Global Styles Section remains unchanged */}
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        *,
        *::before,
        *::after {
          box-sizing: inherit;
        }

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
          color: #fff;
          font-family: sans-serif;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .animate-fade-in-on-scroll {
          animation: fadeIn 1s ease forwards;
          /* Ensure animation starts elements as invisible */
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}