import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || input.trim().length === 0) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const prompt = `
You are an educational AI. Provide a concise and engaging summary of the following topic or link:

"${input}"

Then, generate ten multiple-choice quiz questions based on this summary in the following JSON format:

{
  "summary": "Brief summary of the topic here...",
  "quiz": [
    {
      "question": "First question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "Second question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    },
    {
      "question": "Third question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option C"
    }
  ]
}

Only return the JSON. Do not include any extra text or explanations.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const rawText = result.text || '{}';
    const cleanText = rawText.replace(/```json|```/g, '').trim();

    let json;
    try {
      json = JSON.parse(cleanText);
      console.log("Final parsed JSON:", json); // Log the response for debugging
    } catch (err) {
      console.error('Failed to parse Gemini response:', err);
      return NextResponse.json({ error: 'Failed to parse AI response.' }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (err) {
    console.error('Custom Gemini route error:', err);
    return NextResponse.json({ error: 'Server error while generating summary/quiz.' }, { status: 500 });
  }
}
