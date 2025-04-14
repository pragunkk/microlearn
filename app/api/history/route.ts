import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'data');
  let history = [];

  try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    history = files.map(file => {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      return {
        topic: parsed.topic || 'Untitled',
        date: file.replace('.json', ''),
        score: parsed.score,
      };
    }).sort((a, b) => b.date.localeCompare(a.date)); // sort descending
  } catch (error) {
    console.error("Error reading history:", error);
    history = [];
  }

  return new Response(JSON.stringify(history));
}
