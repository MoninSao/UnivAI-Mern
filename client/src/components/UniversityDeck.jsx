import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UniversityCard from "./UniversityCard";

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-7 flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-5 rounded-lg skeleton w-3/4" />
          <div className="h-3 rounded-lg skeleton w-1/2" />
        </div>
      </div>
      <div className="h-px bg-slate-800" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="stat-card space-y-2">
            <div className="h-2 rounded skeleton w-2/3" />
            <div className="h-4 rounded skeleton w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UniversityDeck() {
  const [universities, setUniversities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);

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

  function goNext() {
    setDirection(1);
    setCurrentIndex((i) => i + 1);
  }

  function goBack() {
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 rounded-lg skeleton" />
          <div className="h-4 w-20 rounded-lg skeleton" />
        </div>
        <SkeletonCard />
        <div className="flex gap-3">
          <div className="flex-1 h-11 rounded-xl skeleton" />
          <div className="flex-1 h-11 rounded-xl skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-64 gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center text-2xl">⚠️</div>
        <p className="text-red-400 font-medium">Error: {error}</p>
      </motion.div>
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
  const progress = ((currentIndex + 1) / universities.length) * 100;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Universities
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({universities.length} total)
            </span>
          </h1>
        </div>
        <span className="text-slate-400 text-sm font-medium tabular-nums">
          {currentIndex + 1} <span className="text-slate-600">/</span> {universities.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Card with slide animation */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "340px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <UniversityCard {...universities[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <motion.button
          onClick={goBack}
          disabled={isFirst}
          whileHover={!isFirst ? { scale: 1.02 } : {}}
          whileTap={!isFirst ? { scale: 0.97 } : {}}
          className="btn-secondary flex-1"
        >
          ← Back
        </motion.button>
        <motion.button
          onClick={goNext}
          disabled={isLast}
          whileHover={!isLast ? { scale: 1.02 } : {}}
          whileTap={!isLast ? { scale: 0.97 } : {}}
          className="btn-primary flex-1"
        >
          Next →
        </motion.button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {universities.slice(0, Math.min(universities.length, 15)).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            animate={{
              width: i === currentIndex ? 20 : 6,
              opacity: i === currentIndex ? 1 : 0.3,
            }}
            className="h-1.5 rounded-full cursor-pointer"
            style={{
              background: i === currentIndex
                ? "linear-gradient(90deg, #4f46e5, #7c3aed)"
                : "#475569",
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
        {universities.length > 15 && (
          <span className="text-slate-600 text-xs self-center">+{universities.length - 15}</span>
        )}
      </div>
    </motion.div>
  );
}
