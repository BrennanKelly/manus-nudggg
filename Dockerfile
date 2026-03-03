# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Enable corepack so pnpm is available
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Install dependencies (leverage layer cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Declare build-time args for VITE_ env vars (Vite bakes these into the bundle)
ARG VITE_APP_ID
ARG VITE_OAUTH_PORTAL_URL
ARG VITE_FRONTEND_FORGE_API_URL
ARG VITE_FRONTEND_FORGE_API_KEY
ARG VITE_APP_TITLE
ARG VITE_APP_LOGO

# Expose them as env vars so Vite picks them up during build
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_OAUTH_PORTAL_URL=$VITE_OAUTH_PORTAL_URL
ENV VITE_FRONTEND_FORGE_API_URL=$VITE_FRONTEND_FORGE_API_URL
ENV VITE_FRONTEND_FORGE_API_KEY=$VITE_FRONTEND_FORGE_API_KEY
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_LOGO=$VITE_APP_LOGO

# Copy source and build
COPY . .
RUN pnpm build

# ── Stage 2: Production image ────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy only what's needed to run
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy compiled server + built frontend
COPY --from=builder /app/dist ./dist

# Railway injects PORT at runtime; default to 3000 for local testing
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
