import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.profile.level}
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
  const [profiles, setProfiles] = useState([]);

  // This method fetches the profiles from the database.
  useEffect(() => {
    async function getProfiles() {
      const response = await fetch(`http://localhost:5050/profile/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const profiles = await response.json();
      setProfiles(profiles);
    }
    getProfiles();
    return;
  }, [profiles.length]);

  // This method will delete a profile
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
      <h3 className="text-lg font-semibold p-4">Employee profiles</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
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