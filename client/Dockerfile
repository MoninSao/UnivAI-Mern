# --- Frontend Dockerfile (multi-stage) ---
# Stage 1 builds the React app with Vite.
# Stage 2 throws away the build tools and just serves the static files with nginx.
# Result: tiny final image (~25MB) instead of carrying around all of node_modules.

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Cache npm install layer (same trick as backend)
COPY package*.json ./
RUN npm ci

# Vite bakes VITE_* env vars into the bundle at BUILD time, not runtime.
# So we need VITE_API_URL available during `npm run build`.
# It's passed in via docker-compose `args` — see docker-compose.yml.
ARG VITE_API_URL=http://localhost:5050
ENV VITE_API_URL=$VITE_API_URL

# Copy source and build — output goes to /app/dist
COPY . .
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Replace the default nginx config with one that handles SPA routing
# (so /universities, /recommendations etc. don't 404 on refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the built static files from stage 1 — leave node_modules behind
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine already has a CMD that starts nginx in the foreground — no need to add one
