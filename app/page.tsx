// app/page.tsx
export default function HomePage() {
  return (
    <div className="space-y-8 text-center">
      <h2 className="text-3xl font-semibold">Ready to learn something new today?</h2>
      

            <a
        href="/lesson"
      >
        <button
            className="btn-gradient hover:scale-105"
          >
            Today's Lesson
      </button>
      </a>


    </div>
  );
}
