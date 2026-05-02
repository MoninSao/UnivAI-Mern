export default function UniversityCard({ name, tuition, city, state, acceptanceRate }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {initial}
        </div>
        <h2 className="text-xl font-semibold text-slate-100 leading-tight">{name}</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tuition</p>
          <p className="text-lg font-semibold text-slate-100">
            ${tuition != null ? Number(tuition).toLocaleString() : "N/A"}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Location</p>
          <p className="text-lg font-semibold text-slate-100">
            {city && state ? `${city}, ${state}` : city || state || "N/A"}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Acceptance</p>
          <p className="text-lg font-semibold text-slate-100">
            {acceptanceRate != null ? `${(Number(acceptanceRate) * 100).toFixed(1)}%` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
