import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionId } from "../utils/session.js";

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function RecCard({ rec, index, navigate }) {
  const colors = [
    "from-indigo-600/20 to-violet-600/10 border-indigo-500/20",
    "from-violet-600/20 to-purple-600/10 border-violet-500/20",
    "from-blue-600/20 to-indigo-600/10 border-blue-500/20",
    "from-purple-600/20 to-pink-600/10 border-purple-500/20",
    "from-cyan-600/20 to-blue-600/10 border-cyan-500/20",
  ];
  const colorClass = colors[index % colors.length];

  return (
    <motion.div
      onClick={() => navigate('/universities?highlight=' + encodeURIComponent(rec.name))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl p-6 flex gap-5 border bg-gradient-to-br ${colorClass} backdrop-blur-sm overflow-hidden cursor-pointer`}
    >
      {/* Rank badge */}
      <div className="shrink-0">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${
              ["#4f46e5,#7c3aed", "#7c3aed,#9333ea", "#2563eb,#4f46e5", "#9333ea,#ec4899", "#0891b2,#2563eb"][index % 5]
            })`,
          }}
        >
          {index + 1}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="text-base font-bold text-slate-100 leading-tight">{rec.name}</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{rec.reason}</p>
        <span className="mt-1 text-xs font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View card →
        </span>
      </div>

      {/* Subtle top-right glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.6), transparent)" }} />
    </motion.div>
  );
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [results, setResults] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: { "X-Session-Id": getSessionId() },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProfile(data[0] ?? null);
        setLoadingProfile(false);
      })
      .catch((err) => {
        setProfileError(err.message);
        setLoadingProfile(false);
      });
  }, []);

  function handleFindMatch() {
    if (!profile) return;
    setLoadingRecs(true);
    setRecError(null);
    setResults(null);

    fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": getSessionId() },
      body: JSON.stringify({ profileId: profile._id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setResults(Array.isArray(data) ? data : data.recommendations ?? []);
        setLoadingRecs(false);
      })
      .catch((err) => {
        setRecError(err.message);
        setLoadingRecs(false);
      });
  }

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading profile…</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center text-xl">⚠️</div>
        <p className="text-red-400">Error loading profile: {profileError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">
          No profile found.{" "}
          <a href="/create" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            Create one first.
          </a>
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 max-w-2xl mx-auto"
    >
      {/* Profile summary card */}
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-medium">Matching for</p>
            <p className="text-base font-bold text-slate-100">{profile.name}</p>
            <p className="text-xs text-slate-400">
              {profile.major}
              <span className="mx-1.5 text-slate-700">·</span>
              GPA {profile.gpa}
              {profile.satScore && (
                <>
                  <span className="mx-1.5 text-slate-700">·</span>
                  SAT {profile.satScore}
                </>
              )}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleFindMatch}
          disabled={loadingRecs}
          whileHover={!loadingRecs ? { scale: 1.03 } : {}}
          whileTap={!loadingRecs ? { scale: 0.97 } : {}}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          {loadingRecs ? (
            <>
              <SpinnerIcon />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Find My Match</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {recError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400"
          >
            Error: {recError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {loadingRecs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-12"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-violet-500/20" />
              <div className="absolute inset-2 rounded-full border-2 border-t-violet-500 animate-spin" style={{ animationDuration: "0.7s" }} />
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-medium">Asking GPT for your best matches…</p>
              <p className="text-slate-500 text-sm mt-1">This may take a few seconds</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">Your Top Matches</h2>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-indigo-300"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                {results.length} results
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {results.map((rec, i) => (
                <RecCard key={i} rec={rec} index={i} navigate={navigate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
