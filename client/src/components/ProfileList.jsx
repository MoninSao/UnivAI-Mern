import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// The following code will serve as a viewing component for our profiles. 
// It will fetch all the profiles in our database through a GET method.

const avatarGradients = [
  ["#6366f1", "#8b5cf6"],
  ["#8b5cf6", "#a855f7"],
  ["#3b82f6", "#6366f1"],
  ["#a855f7", "#ec4899"],
  ["#06b6d4", "#3b82f6"],
];

const statItems = (profile) => [
  { label: "GPA", value: profile.gpa },
  { label: "SAT", value: profile.sat_score },
  { label: "ACT", value: profile.act_score },
];

const ProfileCard = ({ profile, deleteProfile }) => {
  const [g1, g2] = avatarGradients[(profile.name?.charCodeAt(0) || 0) % avatarGradients.length];
  const initial = profile.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #1e1035 50%, #0f172a 100%)",
        border: "1px solid rgba(139,92,246,0.4)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      className="rounded-2xl p-6 cursor-default"
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
            boxShadow: `0 0 20px ${g1}66`,
          }}
        >
          {initial}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-white truncate">{profile.name}</h3>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{
                background: "rgba(99,102,241,0.2)",
                color: "#c7d2fe",
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              {profile.major}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {statItems(profile).map(({ label, value }) =>
              value != null && value !== "" ? (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
                  <span className="text-sm font-bold text-indigo-300">{value}</span>
                </div>
              ) : null
            )}
            {profile.intended_major && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 uppercase tracking-widest">Intended</span>
                <span className="text-sm font-semibold text-violet-300">{profile.intended_major}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/edit/${profile._id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-200 transition-all duration-200"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.35)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474Z" />
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9a.75.75 0 0 1 1.5 0v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
              </svg>
              Edit
            </Link>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => deleteProfile(profile._id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 transition-all duration-200"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
            </svg>
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};


export default function ProfileList() {
  // useState stores a temporary copy of the profiles in the browser's memory (React state).
  // It is NOT stored in the database - it lives only until the page is refreshed or closed.
  // profiles = the current value, setProfiles = the function to update it.
  // When setProfiles is called, React re-renders the screen with the new data.
  const [profiles, setProfiles] = useState([]);

  // useEffect runs automatically when the component loads on screen.
  // Think of it as: "when this component appears, do this thing".
  // The function name getProfiles doesn't matter - it could be named anything.
  // What makes this a GET request is fetch() with no method specified (GET is the default).
  // Flow: component loads → useEffect fires → fetch asks server for profiles → server queries MongoDB → response comes back → setProfiles stores it in state → screen re-renders.
  useEffect(() => {
    async function getProfiles() {
      console.log("[ProfileList] getProfiles called");
      // fetch() is a general-purpose HTTP request tool - not just for GET.
      // Default is GET. To use other methods: fetch(url, { method: "POST" }) etc.
      const response = await fetch(`http://localhost:5050/profile/`);
      console.log("[ProfileList] GET /profiles status:", response.status, "| ok:", response.ok);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const profiles = await response.json();
      console.log("[ProfileList] Profiles received:", profiles);
      // setProfiles stores the fetched data temporarily in the browser - NOT back in the database.
      // It's like photocopying files from a cabinet to your desk.
      // The originals in MongoDB are untouched. Refreshing the page discards this copy.
      setProfiles(profiles);
    }
    getProfiles(); // defining the function above doesn't run it - this line actually calls it.
    return;
  // [profiles.length] = dependency array: re-run this effect when the number of profiles changes.
  }, [profiles.length]);

  // This method does TWO things: deletes from the database AND updates the screen.
  // Step 1: fetch with method "DELETE" sends an HTTP DELETE request to the server.
  //         The server removes the document from MongoDB permanently.
  //         An endpoint is identified by method + path together - same URL, different method = different action.
  // Step 2: filter() loops through the profiles array and keeps everything EXCEPT the deleted one.
  //         setProfiles updates the screen immediately - no need to re-fetch from the database.
  async function deleteProfile(id) {
    await fetch(`http://localhost:5050/profile/${id}`, {
      method: "DELETE",
    });
    const newProfiles = profiles.filter((el) => el._id !== id);
    setProfiles(newProfiles);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #e0e7ff, #a5b4fc, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Student Profile
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {profiles.length > 0 ? "Your saved academic profile" : "No profile created yet"}
          </p>
        </div>
        {profiles.length === 0 && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/create" className="btn-primary flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              New Profile
            </Link>
          </motion.div>
        )}
      </div>

      {/* Empty state */}
      <AnimatePresence mode="wait">
        {profiles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-28 gap-6"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                border: "1px solid rgba(139,92,246,0.3)",
                boxShadow: "0 0 40px rgba(99,102,241,0.15)",
              }}
            >
              🎓
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">No profile yet</p>
              <p className="text-slate-400 text-sm mt-1">Create your profile to find university matches</p>
            </div>
            <Link to="/create" className="btn-primary">
              Create Profile
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <AnimatePresence>
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} deleteProfile={deleteProfile} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}