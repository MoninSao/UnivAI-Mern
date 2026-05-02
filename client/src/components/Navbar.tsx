import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5050/profile/")
      .then((r) => r.json())
      .then((data) => setHasProfile(Array.isArray(data) && data.length > 0))
      .catch(() => {});
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-indigo-900/30 shadow-lg shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <img
              alt="Univ.AI Logo"
              className="h-8 w-auto drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
              src="/ca6342e6-eac1-4f04-ab21-b6e18faccadb.png"
            />
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-slate-100">
            Univ
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              .AI
            </span>
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: "/universities", label: "Universities" },
            { to: "/recommendations", label: "Find My Match" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-300"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="navbar-pill"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.15))",
                          border: "1px solid rgba(99,102,241,0.3)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}

          {!hasProfile && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <NavLink
                to="/create"
                className="ml-2 btn-primary text-xs"
              >
                + New Profile
              </NavLink>
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}