function Stat({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-semibold text-slate-100">{value ?? "N/A"}</p>
    </div>
  );
}

export default function UniversityCard({
  name,
  city,
  state,
  acceptanceRate,
  satAvg,
  tuitionInState,
  tuitionOutState,
  enrollment,
  medianEarnings,
}) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const fmt = (n) => (n != null ? `$${Number(n).toLocaleString()}` : null);
  const pct = (n) => (n != null ? `${(Number(n) * 100).toFixed(1)}%` : null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {initial}
        </div>
        <h2 className="text-xl font-semibold text-slate-100 leading-tight">{name}</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Location" value={city && state ? `${city}, ${state}` : city || state} />
        <Stat label="Acceptance Rate" value={pct(acceptanceRate)} />
        <Stat label="SAT Avg" value={satAvg != null ? Number(satAvg).toLocaleString() : null} />
        <Stat label="Tuition (In-State)" value={fmt(tuitionInState)} />
        <Stat label="Tuition (Out-of-State)" value={fmt(tuitionOutState)} />
        <Stat label="Enrollment" value={enrollment != null ? Number(enrollment).toLocaleString() : null} />
        <Stat
          label="Median Earnings (10yr)"
          value={fmt(medianEarnings)}
        />
      </div>
    </div>
  );
}
