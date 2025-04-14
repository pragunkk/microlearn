// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { AuthButtons } from "@/components/AuthButtons";
import { Inter } from "next/font/google";
import Navbar from '../components/Navbar'; // Import the Navbar component
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MicroLearn",
  description: "Tiny lessons daily with AI-generated summaries and quizzes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`bg-black text-white font-sans min-h-screen ${inter.className}`}>
          <Navbar /> {/* Ensure Navbar is included here */}
          <main className="p-6 max-w-3xl mx-auto">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
