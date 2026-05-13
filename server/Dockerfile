# --- Backend Dockerfile ---


FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS adapter


# Builds an image that runs the Express server.
# Uses node:20-alpine because alpine images are much smaller (~50MB vs ~300MB).
FROM node:20-alpine
COPY --from=adapter /lambda-adapter /opt/extensions/lambda-adapter

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

# Port Express listens on inside the container
ENV PORT=5050
# Tell the Lambda Web Adapter which port to forward incoming requests to
ENV AWS_LWA_PORT=5050
# Wraps the startup command so the adapter initializes before Express starts
ENV AWS_LAMBDA_EXEC_WRAPPER=/opt/bootstrap

# Informational — documents the port the container expects (doesn't publish it)
EXPOSE 5050

# Start the server (adapter wrapper runs first via AWS_LAMBDA_EXEC_WRAPPER)
CMD ["node", "server.js"]
