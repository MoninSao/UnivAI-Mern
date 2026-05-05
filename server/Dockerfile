# --- Backend Dockerfile ---
# Builds an image that runs the Express server.
# Uses node:20-alpine because alpine images are much smaller (~50MB vs ~300MB).

FROM node:20-alpine

# Working directory inside the container — all subsequent commands run from here
WORKDIR /app

# Copy package files FIRST (before source code) so Docker can cache the npm install layer.
# If you change source code but not dependencies, Docker reuses the cached install.
COPY package*.json ./

# Install only production dependencies (no dev/test packages)
# `npm ci` is faster + stricter than `npm install` — uses package-lock.json exactly
RUN npm ci --omit=dev

# Now copy the rest of the source code
COPY . .

# Document which port the container listens on (informational — doesn't actually publish it)
EXPOSE 5050

# Start the server
CMD ["node", "server.js"]
