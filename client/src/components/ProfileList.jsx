import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// The following code will serve as a viewing component for our profiles. 
// It will fetch all the profiles in our database through a GET method.

// Profile is just a blank template - it has no idea what data exists.
// It only knows what it receives through props (short for properties).
// The parent component (ProfileList) fills it in with real data by passing <Profile profile={oneItem} />.
// React components MUST start with a capital letter - lowercase would be treated as a plain HTML tag.
const Profile = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.gpa}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.major}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.profile._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
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
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Student profiles</h3>
        {profiles.length === 0 && (
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to="/create"
          >
            Create Profile
          </Link>
        )}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  GPA
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Major
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {profileList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}