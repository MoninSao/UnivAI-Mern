import { useState, useEffect } from "react";
import UniversityCard from "./UniversityCard";

export default function UniversityDeck() {
  const [universities, setUniversities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5050/university")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUniversities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading universities…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">No universities found.</p>
      </div>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === universities.length - 1;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-100">Universities</h1>
        <span className="text-slate-400 text-sm">
          {currentIndex + 1} of {universities.length}
        </span>
      </div>

      <UniversityCard {...universities[currentIndex]} />

      <div className="flex gap-3 justify-between">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={isFirst}
          className="flex-1 py-2.5 rounded-lg font-medium transition-colors bg-slate-800 text-slate-100 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentIndex((i) => i + 1)}
          disabled={isLast}
          className="flex-1 py-2.5 rounded-lg font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
