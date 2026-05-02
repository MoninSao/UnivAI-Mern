import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            alt="Univ.AI Logo"
            className="h-9 w-auto"
            src="/ca6342e6-eac1-4f04-ab21-b6e18faccadb.png"
          />
          <span className="text-lg font-semibold tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors">
            Univ<span className="text-indigo-500">.</span>AI
          </span>
        </NavLink>

      </nav>
    </header>
  );
}