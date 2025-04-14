import Link from 'next/link';
import { AuthButtons } from '@/components/AuthButtons'; // Import the AuthButtons component

export default function Navbar() {
  return (
    <nav className="navbar-gradient p-6 shadow-md rounded-b-xl flex justify-between items-center">
      <div className="text-white text-xl font-bold">MicroLearn</div>
      <ul className="navbar-links">
        <li>
          <Link href="/" className="navbar-link">Home</Link>
        </li>
        <li>
          <Link href="/lesson" className="navbar-link">Lesson</Link>
        </li>
        <li>
          <Link href="/quiz" className="navbar-link">Quiz</Link>
        </li>
        <li>
          <Link href="/history" className="navbar-link">History</Link>
        </li>
        <li>
          <Link href="/profile" className="navbar-link">Profile</Link>
        </li>
      </ul>
      <AuthButtons /> {/* Place AuthButtons here */}
    </nav>
  );
}
