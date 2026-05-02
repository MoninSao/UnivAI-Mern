import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        satScore: "",
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
            setForm({ name: "", gpa: "", major: "", satScore: ""});
            navigate("/");
        }
    }

    // This following section will display the form that takes the input from the user.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto"
    >
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.2))", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            {isNew ? "✨" : "✏️"}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            {isNew ? "Create Profile" : "Edit Profile"}
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-13">
          {isNew ? "Add a new student record to the database." : "Update this student's information."}
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={onSubmit}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="p-8 flex flex-col gap-6">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="input-field"
              placeholder="First Last"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </motion.div>

          {/* GPA */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="gpa" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              GPA
            </label>
            <input
              type="text"
              name="gpa"
              id="gpa"
              className="input-field"
              placeholder="e.g. 3.8"
              value={form.gpa}
              onChange={(e) => updateForm({ gpa: e.target.value })}
            />
          </motion.div>

          {/* Major */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="major" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Major
            </label>
            <input
              type="text"
              name="major"
              id="major"
              className="input-field"
              placeholder="e.g. Computer Science"
              value={form.major}
              onChange={(e) => updateForm({ major: e.target.value })}
            />
          </motion.div>

          {/* SAT Score */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label htmlFor="satScore" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              SAT Score <span className="normal-case text-slate-500">(optional)</span>
            </label>
            <input
              type="number"
              name="satScore"
              id="satScore"
              className="input-field"
              placeholder="400–1600"
              value={form.satScore}
              onChange={(e) => updateForm({ satScore: e.target.value })}
            />
          </motion.div>
        </div>

        {/* Footer actions */}
        <div
          className="flex items-center justify-end gap-3 px-8 py-5"
          style={{ borderTop: "1px solid rgba(99,102,241,0.12)", background: "rgba(15,23,42,0.5)" }}
        >
          <motion.button
            type="button"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
          >
            Cancel
          </motion.button>
          <motion.input
            type="submit"
            value="Save Profile"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary cursor-pointer"
          />
        </div>
      </form>
    </motion.div>
  );
}

