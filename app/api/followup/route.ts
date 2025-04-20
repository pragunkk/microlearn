import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, summary, question } = await req.json();

    if (!topic || !summary || !question) {
      return NextResponse.json({ error: "Missing topic, summary, or question." }, { status: 400 });
    }

    const prompt = `
You are an educational AI. A user just learned about the topic: "${topic}".

Here is a short summary of what they learned:
${summary}

Now the user is asking this follow-up question:
"${question}"

Please answer clearly, concisely, and in a beginner-friendly way.
`;

const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

    const responseText = result.text?.trim() || "Sorry, I couldn't generate an answer.";

    return NextResponse.json({ answer: responseText });
  } catch (err) {
    console.error("Error in follow-up route:", err);
    return NextResponse.json({ error: "Failed to generate follow-up answer." }, { status: 500 });
  }
}
