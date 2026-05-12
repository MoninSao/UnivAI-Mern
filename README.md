# UnivAI-MERN

A full-stack MERN (MongoDB, Express, React, Node.js) web application for AI-powered university recommendations. Each visitor creates a personal student profile — storing their name, GPA, SAT score, and major — which is isolated to their browser using a sessionId stored in `localStorage`. The app fetches live university data from the **College Scorecard API** and uses **OpenAI (gpt-4o-mini)** to recommend the top 5 best-matched universities with personalized reasons for each. Deployed on **Render** (backend) and **Vercel** (frontend).

---

## Tech Stack

| Layer            | Technology                                            |
|------------------|-------------------------------------------------------|
| Frontend         | React 19, Vite, Tailwind CSS, React Router DOM        |
| Backend          | Node.js, Express 5                                    |
| Database         | MongoDB Atlas (cloud, persistent)                     |
| Session Store    | Browser `localStorage` (per-visitor, temporary)       |
| External APIs    | College Scorecard API, OpenAI gpt-4o-mini             |
| Containerization | Docker, Docker Compose, nginx (multi-stage builds)    |
| CI               | GitHub Actions (Docker image builds on every push)    |
| Deployment       | Render (backend), Vercel (frontend)                   |


---

## Project Structure

```
UnivAI-Mern/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                # Root component + React Router routes
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Top nav — hides "New Profile" if session already has one
│   │   │   ├── Profile.jsx        # Create/edit profile form
│   │   │   ├── ProfileList.jsx    # Displays this browser's saved profile
│   │   │   ├── Recommendations.jsx# AI university match results
│   │   │   ├── UniversityCard.jsx # Single university display card
│   │   │   └── UniversityDeck.jsx # Browsable deck of all universities
│   │   └── utils/
│   │       └── session.js         # getSessionId() — localStorage UUID utility
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                        # Express backend
    ├── server.js                  # Entry point — middleware, CORS, route wiring
    ├── .env                       # Environment variables (never committed)
    ├── db/
    │   └── connection.js          # MongoDB Atlas connection (exits process on failure)
    ├── routes/
    │   ├── profile.js             # CRUD routes for /profile — filtered by X-Session-Id
    │   ├── university.js          # GET /university — proxies College Scorecard API
    │   └── reccomendation.js      # POST /recommendations — OpenAI with caching
    └── external_api/
        ├── college_scorecard.js   # Fetches live university data
        ├── buildPrompt.js         # Formats profile + universities into an OpenAI prompt
        └── openai.js              # Calls gpt-4o-mini, returns top 5 matches
```

---

## Environment Variables

All secrets and configuration live in environment variables — **never hardcoded in source code**.

### Backend — `server/.env` (local dev) / Render dashboard (production)

```env
# MongoDB Atlas connection string
ATLAS_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<AppName>"

# Port the Express server listens on
PORT=5050

# URL of the deployed frontend — used to restrict CORS (see CORS section below)
# Local dev: http://localhost:5173 | Production: your Vercel URL
CLIENT_URL=http://localhost:5173

# College Scorecard API key — get one at https://api.data.gov/signup/
COLLEGE_SCORECARD_API_KEY=your_key_here

# OpenAI API key
OPENAI_API_KEY=sk-your_key_here
```

### Frontend — `client/.env.local` (local dev) / Vercel dashboard (production)

```env
# Base URL of the backend API (no trailing slash)
# Local dev: http://localhost:5050 | Production: your Render URL
VITE_API_URL=http://localhost:5050
```

> All `VITE_` prefixed variables are bundled into the client at build time by Vite. Never put secrets in `VITE_` variables — they are visible in the browser.

---

## CORS Configuration

CORS (Cross-Origin Resource Sharing) is the browser security rule that blocks a frontend on one domain from calling a backend on a different domain. Without it, `vercel.app` cannot talk to `onrender.com`.

In `server/server.js`:
```js
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
```

- `process.env.CLIENT_URL` is set to your Vercel URL in the **Render dashboard → Environment tab**.
- Locally it falls back to `http://localhost:5173`.
- This tells the browser: "only requests coming from this exact origin are allowed."

> If you ever change your Vercel URL, update `CLIENT_URL` in Render and redeploy the backend.

---

## MongoDB Atlas — Network Access

MongoDB Atlas blocks all incoming connections by default. Because Render uses dynamic IPs that change on every deploy, you cannot whitelist a specific IP.

**Required Atlas setting:**
1. Go to **MongoDB Atlas → Network Access**
2. Click **Add IP Address**
3. Enter `0.0.0.0/0` — this allows connections from anywhere
4. Save

> This is standard practice for Render/Railway/Heroku deployments. The connection is still secured by your `ATLAS_URI` username and password.

---

## Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → connect `MoninSao/UnivAI-Mern`
3. Set **Root Directory** to `server`
4. Set **Build Command** to `npm install` and **Start Command** to `node server.js`
5. Under **Environment** tab, add all backend variables:
   - `ATLAS_URI`
   - `OPENAI_API_KEY`
   - `COLLEGE_SCORECARD_API_KEY`
   - `PORT=5050`
   - `CLIENT_URL=https://<your-vercel-app>.vercel.app`
6. Deploy — Render gives you a public URL like `https://univai-mern.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import `MoninSao/UnivAI-Mern`
2. Set **Root Directory** to `client`
3. Under **Environment Variables**, add:
   - `VITE_API_URL=https://<your-render-service>.onrender.com` (no trailing slash)
4. Deploy — Vercel gives you a URL like `https://univai-mern.vercel.app`
5. Go back to Render → update `CLIENT_URL` to your Vercel URL → redeploy

Both services now reference each other correctly.

---

## Running with Docker

The app can run fully containerized using Docker and Docker Compose. The backend connects to the same MongoDB Atlas cluster used in production — no local MongoDB container needed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine + Compose)

### Setup

```bash
# 1. Start both containers (builds images on first run)
docker-compose up --build

# 2. Visit the app
#    Frontend: http://localhost:8080
#    Backend:  http://localhost:5050
```

To stop:

```bash
docker-compose down
```

### Architecture

| Service  | Image base       | Container port | Host port | Notes                              |
|----------|------------------|----------------|-----------|------------------------------------|
| backend  | node:20-alpine   | 5050           | 5050      | Express server, connects to Atlas  |
| frontend | nginx:alpine     | 80             | 8080      | Vite build served by nginx         |

The frontend image is multi-stage: stage 1 builds the React app with Node, stage 2 serves the static `dist/` folder with nginx. Final image is ~25 MB.

`VITE_API_URL` is baked into the frontend bundle at build time via a Docker build arg — not a runtime environment variable.

### CI/CD

Both Docker images build automatically on every push and PR to `main` via GitHub Actions (`.github/workflows/ci.yml`). The workflow verifies the Dockerfiles are valid — it does not push to a registry.

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a cluster

### 1. Backend

```bash
cd server
npm install
node --env-file=.env server.js
```

> `--env-file=.env` loads environment variables from `.env` without an extra package. Requires **Node.js v18+**.

**Expected output:**
```
Pinged your development. You successfully connected to MongoDB!
server listening on port 5050
```

### 2. Frontend

Open a **second** terminal:

```bash
cd client
npm install
npm run dev
```

**Expected output:**
```
VITE vX.X.X  ready in Xms
➜  Local:   http://localhost:5173/
```

---

## After Every Pull

Reinstall dependencies in both directories in case new packages were added:

```bash
cd server && npm install
cd ../client && npm install
```

---

### CORS error in browser console
- Confirm `CLIENT_URL` is set to your exact Vercel URL in Render (no trailing slash).
- After updating `CLIENT_URL`, trigger a manual redeploy on Render.

### `VITE_API_URL` not working in production
- Confirm the variable is set in **Vercel → Settings → Environment Variables** (not just `.env.local`).
- Vercel requires a redeploy after adding/changing env variables.

### `--env-file` flag not recognized
- Requires **Node.js v18+**. Run `node --version` to check.

### Port already in use (`EADDRINUSE`)
```bash
lsof -i :5050    # find the process
kill -9 <PID>    # kill it
```

### `npm install` errors
```bash
rm -rf node_modules package-lock.json
npm install
```
Run this separately in both `server/` and `client/`.

