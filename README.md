# 📘 MicroLearn

MicroLearn is a minimalist, AI-powered daily learning web app that delivers bite-sized lessons and quizzes based on trending topics. Built with **Next.js**, it uses **Gemini AI** to summarize a random top Wikipedia topic and auto-generate quiz questions for interactive learning.

> ⚡️ Learn something new every day—in under 2 minutes.

---

## ✨ Features

- 🎯 **Daily Lessons**  
  Fetches and summarizes a trending topic from Wikipedia.

- 🧠 **AI-Generated Quizzes**  
  Tests your understanding with a short multiple-choice quiz.

- 🎨 **Dynamic Background UI**  
  Mouse-responsive and animated multi-blob gradient background using **Tailwind CSS** and custom CSS.

- 💡 **No Account Required**  
  No login, no database—just quick learning.

---

## 🛠 Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** with custom animations
- **Gemini API (`@google/generative-ai`)**
- **Wikipedia Top 10 API**
- **Clerk (Optional)** for session handling (no DB used)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/microlearn.git
cd microlearn

2. Install dependencies
bash
Copy
Edit
npm install

3. Set up environment variables
Create a .env.local file:

bash
Copy
Edit
GOOGLE_API_KEY=your_gemini_api_key
You can get your Gemini API key from https://makersuite.google.com/app/apikey

4. Run the development server
bash
Copy
Edit
npm run dev