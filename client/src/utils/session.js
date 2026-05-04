// Returns a stable session ID for this browser.
// On first visit, a UUID is generated and saved to localStorage.
// On subsequent visits, the same ID is returned so the user's profile persists.
export function getSessionId() {
    let id = localStorage.getItem("sessionId");
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("sessionId", id);
    }
    return id;
}
