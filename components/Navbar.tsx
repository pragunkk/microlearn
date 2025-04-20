import Link from 'next/link';
import Image from 'next/image';
import { AuthButtons } from '@/components/AuthButtons'; // Import the AuthButtons component

export default function Navbar() {
  return (
    <nav className="navbar-gradient p-6 shadow-md rounded-b-xl flex justify-between items-center">
      <div className="text-white text-xl font-bold">
        <Image
          src="/logo.png" // Make sure to place your logo image in the public directory as 'public/logo.png'
          alt="MicroLearn Logo"
          width={300}
          height={100}
          className="object-contain"
        />
      </div>
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
          <Link href="/archive" className="navbar-link">Archive</Link>
        </li>
        <li>
          <Link href="/profile" className="navbar-link">Profile</Link>
        </li>
        <li>
          <Link href="/custom" className="navbar-link">Custom</Link>
        </li>
      </ul>
      <AuthButtons /> {/* Place AuthButtons here */}
    </nav>
  );
}
