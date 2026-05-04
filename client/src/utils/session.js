// --- What is localStorage? ---
// localStorage is a small key-value store built into every browser.
// It is completely separate from MongoDB:
//   - MongoDB lives on the server (Render) and stores data permanently across all users.
//     It is the real "database" — data there survives restarts and is shared by everyone.
//   - localStorage lives in THIS browser on THIS device only. Nothing in localStorage is
//     ever sent to a server automatically. It survives page refreshes and tab closes,
//     but is wiped if the user clears their browser data or uses a different browser/device.
//   - React state (useState) is even more temporary than localStorage — it only lives while
//     the component is mounted. A page refresh clears all React state completely.
//
// --- Why do we use localStorage here? ---
// We need a way to tell the server "all these requests belong to the same person" without
// building a full login system. We do this by generating a random UUID once per browser,
// saving it to localStorage, and sending it as a header on every API request. The server
// reads that header and filters its MongoDB query to only return THAT browser's profile.
//
// Flow:
//   1st visit   → localStorage has no "sessionId" → generate UUID → save to localStorage → return it
//   Later visits → localStorage already has "sessionId" → just return it (same ID every time)
//
// Example ID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
// Note: this is NOT a secure login. If the user clears localStorage they get a new ID
// and will no longer see their old profile (it still exists in MongoDB but is unreachable).
export function getSessionId() {
    let id = localStorage.getItem("sessionId");
    if (!id) {
        // crypto.randomUUID() is a browser built-in that generates a globally unique ID.
        // The chance of two browsers ever producing the same UUID is astronomically small.
        id = crypto.randomUUID();
        // Persist it so every future visit to this browser returns the same ID.
        localStorage.setItem("sessionId", id);
    }
    return id;
}
