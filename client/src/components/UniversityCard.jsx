import { motion } from "framer-motion";

function Stat({ label, value, highlight }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="stat-card group"
    >
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-medium">{label}</p>
      <p
        className={`text-sm font-semibold leading-tight ${
          highlight ? "gradient-text" : "text-slate-100"
        }`}
      >
        {value ?? <span className="text-slate-600">—</span>}
      </p>
    </motion.div>
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

  // Generate a consistent accent color from the university initial
  const colors = [
    ["from-indigo-600 to-violet-600", "rgba(99,102,241,0.5)"],
    ["from-violet-600 to-purple-600", "rgba(139,92,246,0.5)"],
    ["from-blue-600 to-indigo-600", "rgba(59,130,246,0.5)"],
    ["from-purple-600 to-pink-600", "rgba(168,85,247,0.5)"],
  ];
  const colorIdx = (initial.charCodeAt(0) || 0) % colors.length;
  const [gradientClass, glowColor] = colors[colorIdx];

  return (
    <motion.div
      layout
      className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col gap-6 relative overflow-hidden"
    >
      {/* Ambient glow blob */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg`}
          style={{ boxShadow: `0 4px 20px ${glowColor}` }}
        >
          {initial}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 leading-tight">{name}</h2>
          {(city || state) && (
            <p className="text-sm text-slate-400 mt-0.5">
              📍 {[city, state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Acceptance Rate" value={pct(acceptanceRate)} highlight={acceptanceRate != null && Number(acceptanceRate) < 0.15} />
        <Stat label="SAT Average" value={satAvg != null ? Number(satAvg).toLocaleString() : null} />
        <Stat label="Enrollment" value={enrollment != null ? Number(enrollment).toLocaleString() : null} />
        <Stat label="Tuition In-State" value={fmt(tuitionInState)} />
        <Stat label="Tuition Out-of-State" value={fmt(tuitionOutState)} />
        <Stat label="Median Earnings (10yr)" value={fmt(medianEarnings)} highlight={medianEarnings != null} />
      </div>
    </motion.div>
  );
}

