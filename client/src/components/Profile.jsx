import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// The following code will serve as a form component to create or update profiles. 
// This component will either submit a create command or an update command to our server.

export default function Profile(){
    // useState stores a value React watches. When it changes, the screen re-renders.
    // form = current value of the form fields, setForm = function to update them.
    // Starts empty so the form fields are blank when creating a new profile.
    const [form, setForm] = useState({
        name: "",
        gpa: "",
        major:"",
    });

    // isNew tracks whether this is a CREATE (true) or EDIT (false) operation.
    // Used later to decide whether to call POST (create) or PATCH (update) on submit.
    const [isNew, setIsNew] = useState(true);

    // useParams reads the :id from the URL. If URL is /edit/abc123, params.id = "abc123".
    // React Router puts it there automatically based on your route definition.
    const params = useParams();

    // useNavigate lets you redirect the user to another page in code.
    // e.g. navigate("/") sends the user to the home page.
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const id = params.id?.toString() || undefined;
            if(!id) return; // no id in the URL means this is a new profile, skip fetching

            // setIsNew(false) flips the flag to tell the component this is an EDIT not a CREATE.
            // The form will call PATCH (update) instead of POST (create) when submitted.
            setIsNew(false);

            const response = await fetch(`http://localhost:5050/profile/${params.id.toString()}`);

            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const profile = await response.json();
            if (!profile) {
                console.warn(`Profile with id ${id} not found`);
                navigate("/");
                return;
            }
            // setForm pre-fills the form with the existing profile data from the database.
            // This is why the name/gpa/major fields are already filled in when you open the edit form.
            // It is stored temporarily in React state (browser memory), NOT saved to the database yet.
            setForm(profile);
        }

        fetchData(); // defining the function above doesn't run it - this line actually calls it.
    return;
    // dependency array: re-run this effect if params.id or navigate changes.
    // e.g. navigating from /edit/abc to /edit/xyz triggers a re-fetch for the new profile.
    }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
}

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
        const person = { ...form };
        console.log("[Profile] onSubmit fired. isNew:", isNew, "| form data:", person);
        try {
            let response;
            if (isNew) {
                 // if we are adding a new profile we will POST to /profiles.
                 response = await fetch("http://localhost:5050/profile", {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(person),
            });
        } else {
            // if we are updating a record we will patch to /profiles/:id
            response = await fetch(`http://localhost:5050/profile/${params.id}`, {
                method: "PATCH",
                headers: {
                     "Content-Type": "application/json",
                },
                body: JSON.stringify(person),
        });
    }
    console.log("[Profile] Response status:", response.status, "| ok:", response.ok);
    const responseBody = await response.clone().json().catch(() => null);
    console.log("[Profile] Response body:", responseBody);
    if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        } catch (error) {
        console.error('[Profile] Fetch error:', error);
        } finally {
        console.log("[Profile] finally block reached — navigating to /");
            setForm({ name: "", gpa: "", major: ""});
            navigate("/");
        }
    }

    // This following section will display the form that takes the input from the user.
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
          {isNew ? "Create Student Profile" : "Edit Student Profile"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {isNew ? "Add a new student record to the database." : "Update this student's information."}
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-slate-950/50 overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 p-8 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Student Info
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Fill in the student's academic details. This information will be stored in the database.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ring-offset-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:max-w-md"
                placeholder="First Last"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
            </div>
            {/* GPA */}
            <div>
              <label
                htmlFor="gpa"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                GPA
              </label>
              <input
                type="text"
                name="gpa"
                id="gpa"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ring-offset-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:max-w-md"
                placeholder="e.g. 3.8"
                value={form.gpa}
                onChange={(e) => updateForm({ gpa: e.target.value })}
              />
            </div>
            {/* Major */}
            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Major
              </label>
              <input
                type="text"
                name="major"
                id="major"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ring-offset-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:max-w-md"
                placeholder="e.g. Computer Science"
                value={form.major}
                onChange={(e) => updateForm({ major: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-8 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <input
            type="submit"
            value="Save Profile"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          />
        </div>
      </form>
    </>
  );
}
