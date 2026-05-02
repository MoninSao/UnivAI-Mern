import { useState, useEffect } from "react";

export default function Recommendations() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [results, setResults] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5050/profile")
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

    fetch("http://localhost:5050/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading profile…</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Error loading profile: {profileError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">
          No profile found.{" "}
          <a href="/create" className="text-indigo-400 hover:text-indigo-300 underline">
            Create one first.
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Profile summary + trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Matching for</p>
          <p className="text-lg font-semibold text-slate-100">{profile.name}</p>
          <p className="text-sm text-slate-400">
            {profile.major} · GPA {profile.gpa}
          </p>
        </div>
        <button
          onClick={handleFindMatch}
          disabled={loadingRecs}
          className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingRecs ? "Finding…" : "Find My Match"}
        </button>
      </div>

      {/* Error */}
      {recError && (
        <p className="text-red-400 text-sm">Error: {recError}</p>
      )}

      {/* Loading */}
      {loadingRecs && (
        <div className="flex items-center justify-center h-32">
          <p className="text-slate-400">Asking GPT for your best matches…</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-100">Your Top Matches</h2>
          {results.map((rec, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {rec.name ? rec.name.charAt(0).toUpperCase() : i + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-100">{rec.name}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
