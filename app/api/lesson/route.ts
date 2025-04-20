import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const dataDir = path.join(process.cwd(), 'data'); // Directory to store daily lessons

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

async function fetchInterestingTopic(): Promise<string> {
  try {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");
    const day = String(today.getUTCDate() - 2).padStart(2, "0");

    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`
    );

    const data = await res.json();
    const articles = data.items[0].articles;

    const filtered = articles.filter(
      (a: any) =>
        !a.article.startsWith("Special:") &&
        !a.article.includes("Main_Page") &&
        /^[A-Za-z0-9 _()-]+$/.test(a.article)
    );

    const randomTopic = decodeURIComponent(
      filtered[Math.floor(Math.random() * filtered.length)].article.replace(/_/g, " ")
    );

    return randomTopic;
  } catch (e) {
    console.error("Failed to fetch topic, using fallback:", e);
    return "Artificial Intelligence";
  }
}

async function generateLessonAndQuiz(topic: string) {
  const prompt = `
You are an educational AI. Provide an engaging summary of the topic "${topic}" in no more than 200 words.

Then, create one multiple-choice quiz question in this JSON format:

{
  "topic": "The Topic",
  "summary": "200-word summary here...",
  "quiz": {
    "question": "Question related to the topic",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
}
the correctAnswer field must contain the entire string which is in th option and not the option letter.
Only return valid JSON with those three fields. No explanation or extra text.
`;

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const rawText = result.text || '{}';
  const cleanText = rawText.replace(/```json|```/g, '').trim(); // Remove markdown formatting

  let json;
  try {
    json = JSON.parse(cleanText);
  } catch (err) {
    console.error("Error parsing Gemini API response:", err);
    json = { error: "Failed to generate valid content." };
  }

  return json;
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const filePath = path.join(dataDir, `${today}.json`); // File path to store today's data

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return NextResponse.json(existingData);
    }

    // If data doesn't exist, fetch the topic and generate the lesson and quiz
    const topic = await fetchInterestingTopic();
    const lessonData = await generateLessonAndQuiz(topic);

    // Save the generated data to a file for the current date
    fs.writeFileSync(filePath, JSON.stringify(lessonData, null, 2));

    return NextResponse.json(lessonData);
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Error generating lesson" }, { status: 500 });
  }
}
