import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// The following code will serve as a viewing component for our profiles. 
// It will fetch all the profiles in our database through a GET method.

// Profile is just a blank template - it has no idea what data exists.
// It only knows what it receives through props (short for properties).
// The parent component (ProfileList) fills it in with real data by passing <Profile profile={oneItem} />.
// React components MUST start with a capital letter - lowercase would be treated as a plain HTML tag.
const Profile = (props) => (
  <tr className="border-b border-slate-800 transition-colors hover:bg-slate-800/50">
    <td className="p-4 align-middle text-slate-100 font-medium">
      {props.profile.name}
    </td>
    <td className="p-4 align-middle text-slate-300">
      {props.profile.gpa}
    </td>
    <td className="p-4 align-middle text-slate-300">
      {props.profile.major}
    </td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center rounded-md border border-slate-600 bg-slate-800 px-3 h-8 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-colors"
          to={`/edit/${props.profile._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center rounded-md border border-red-900 bg-slate-800 px-3 h-8 text-sm font-medium text-red-400 hover:bg-red-950 hover:border-red-700 transition-colors"
          type="button"
          onClick={() => {
            props.deleteProfile(props.profile._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

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

  // This method will map out the profiles on the table
  function profileList() {
    return profiles.map((profile) => {
      return (
        <Profile
          profile={profile}
          deleteProfile={() => deleteProfile(profile._id)}
          key={profile._id}
        />
      );
    });
  }

  // This following section will display the table with the profiles of individuals.
  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Student Profiles</h2>
          <p className="mt-1 text-sm text-slate-400">Manage and review all student records.</p>
        </div>
        {profiles.length === 0 && (
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Create Profile
          </Link>
        )}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg shadow-slate-950/50">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Name
                </th>
                <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">
                  GPA
                </th>
                <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Major
                </th>
                <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No profiles yet. Create one to get started.
                  </td>
                </tr>
              ) : profileList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}