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
      <h3 className="text-lg font-semibold p-4">Create/Update Student Profile</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Student Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="gpa"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                GPA
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="gpa"
                    id="gpa"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="e.g. 3.8"
                    value={form.gpa}
                    onChange={(e) => updateForm({ gpa: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="major"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Major
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="major"
                    id="major"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="e.g. Computer Science"
                    value={form.major}
                    onChange={(e) => updateForm({ major: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
