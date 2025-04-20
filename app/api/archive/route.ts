import fs from 'fs';
import path from 'path';

type ArchiveEntry = {
  topic: string;
  summary: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  } | null;
  date: string;
};

export async function GET() {
  const dataDir = path.join(process.cwd(), 'data');
  let archive: ArchiveEntry[] = [];

  try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    archive = files.map(file => {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      return {
        topic: parsed.topic || 'Untitled',
        summary: parsed.summary || '',
        quiz: parsed.quiz || null,
        date: file.replace('.json', ''),
      };
    }).sort((a, b) => b.date.localeCompare(a.date)); // newest first
  } catch (error) {
    console.error("Error reading archive:", error);
    archive = [];
  }

  return new Response(JSON.stringify(archive), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
