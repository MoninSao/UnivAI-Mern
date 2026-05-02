# UnivAI-MERN

A full-stack MERN (MongoDB, Express, React, Node.js) web application for AI-powered university recommendations. Users can create and manage a student profile — storing their name, GPA, and major — backed by a MongoDB Atlas cloud database. The app fetches live university data from the **College Scorecard API** and uses **OpenAI (gpt-4o-mini)** to recommend the top 5 best-matched universities with personalized reasons for each.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, React Router DOM  |
| Backend    | Node.js, Express 5                              |
| Database   | MongoDB Atlas (cloud)                           |
| Ext. APIs  | College Scorecard API, OpenAI gpt-4o-mini            |

---

## Project Structure

```
UnivAI-Mern/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Root component
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   ├── Profile.jsx          # Single profile view
│   │   │   └── ProfileList.jsx      # Displays list of student profiles
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                  # Express backend
    ├── server.js            # App entry point, middleware, route wiring
    ├── .env                 # Environment variables (not committed)
    ├── db/
    │   └── connection.js    # MongoDB Atlas connection
    ├── routes/
    │   ├── profile.js           # CRUD API routes for /profile
    │   ├── university.js        # GET /university — fetches from College Scorecard
    │   └── reccomendation.js    # POST /recommendations — AI recommendations
    └── external_api/
        ├── college_scorecard.js # Fetches live university data from College Scorecard API
        ├── buildPrompt.js       # Formats student + universities into OpenAI prompt
        └── openai.js            # Calls gpt-4o-mini, returns top 5 matched universities
```

---

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher (v18+ is required for the `--env-file` flag)
- npm (bundled with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a cluster and a connection string

---

## Environment Setup

The backend reads configuration from `server/.env`. This file is **not** committed to source control in production — keep it local and private.

```env
# server/.env

# MongoDB Atlas connection string
ATLAS_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<AppName>"

# Port the Express server will listen on
PORT=5050

# API key for the College Scorecard API
COLLEGE_SCORECARD_API_KEY=your_key_here

# API key for OpenAI
OPENAI_API_KEY=sk-your_key_here
```

Replace `<username>`, `<password>`, `<cluster>`, and `<AppName>` with your own MongoDB Atlas credentials.

---

## Starting the Project

### 1. Backend (Express + MongoDB)

Open a terminal and navigate to the `server/` directory:

```bash
cd server
npm install          # Install backend dependencies (only needed once or after a pull)
node --env-file=.env server.js
```

> The `--env-file=.env` flag loads environment variables from `.env` without a separate package. Requires **Node.js v18+**.

**Expected output:**
```
Pinged your development. You successfully connected to MongoDB!
server listening on port 5050
```

The API is now available at `http://localhost:5050`.

---

### 2. Frontend (React + Vite)

Open a **second** terminal and navigate to the `client/` directory:

```bash
cd client
npm install          # Install frontend dependencies (only needed once or after a pull)
npm run dev
```

**Expected output:**
```
  VITE vX.X.X  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

The app is now running at `http://localhost:5173`.

---

## After Every Pull

Whenever you pull new changes, reinstall dependencies in **both** directories in case new packages were added:

```bash
cd server && npm install
cd ../client && npm install
```

---

## API Endpoints

All routes are prefixed with `/profile` and served at `http://localhost:5050`.

| Method   | Endpoint        | Description                  |
|----------|-----------------|------------------------------|
| `GET`    | `/profile`      | Get all profiles             |
| `GET`    | `/profile/:id`  | Get a single profile by ID   |
| `POST`   | `/profile`      | Create a new profile         |
| `PATCH`  | `/profile/:id`  | Update a profile by ID       |
| `DELETE` | `/profile/:id`  | Delete a profile by ID       |

**Profile document shape:**
```json
{
  "name": "Jane Doe",
  "gpa": 3.8,
  "major": "Computer Science"
}
```

---

## Debugging Common Issues

### `Error: ATLAS_URI is not defined` or MongoDB connection fails
- Confirm `.env` exists inside the `server/` directory.
- Make sure you are running the server from the `server/` directory (not the root).
- Verify your Atlas connection string is correct and your IP address is whitelisted in the Atlas Network Access settings.

### `--env-file` flag not recognized
- This flag requires **Node.js v18 or higher**. Run `node --version` to check.
- If you're on an older version, install Node.js v18+ or use the `dotenv` package as an alternative.

### `Cannot GET /` on `http://localhost:5050`
- This is expected — the server has no root route. Use `/profile` instead.

### Frontend shows no data / network errors
- Make sure the **backend is running** on port 5050 before starting the frontend.
- Open browser DevTools → Network tab to inspect failed requests and confirm they are hitting `http://localhost:5050/profile`.
- Check that CORS is not blocked; the server has `app.use(cors())` enabled for all origins.

### Port already in use (`EADDRINUSE`)
- Something else is running on port 5050 (or 5173 for the frontend).
- Find and kill the process:
  ```bash
  lsof -i :5050        # find the process using port 5050
  kill -9 <PID>        # replace <PID> with the process ID shown
  ```
- Alternatively, change the `PORT` value in `config.env` and update any fetch URLs in the frontend accordingly.

### `npm install` errors
- Delete `node_modules` and `package-lock.json` and retry:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Do this separately in both `server/` and `client/` if needed.
