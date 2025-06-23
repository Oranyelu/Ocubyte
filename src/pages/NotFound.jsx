// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-8">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-lg mb-6">Oops, you just byte into a void.</p>
      <Link to="/" className="underline text-ocubyte-accent hover:text-white">
        Return to Home
      </Link>
    </div>
  );
}
