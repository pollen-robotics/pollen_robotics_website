# --- Build stage: compile the Next.js app (standalone output) ---
FROM node:20-slim AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
# Baked into the client bundle + used by metadata/sitemap. Override per Space.
ENV NEXT_PUBLIC_SITE_URL=https://pollen-robotics.com
# Reachy catalog backend (server-side fetch of /api/js-apps).
ENV REACHY_API_BASE=https://pollen-robotics-reachy-mini.hf.space
# Same backend, exposed to the client bundle for the HF OAuth/likes config.
ENV NEXT_PUBLIC_REACHY_API_BASE=https://pollen-robotics-reachy-mini.hf.space

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime stage: run the standalone server ---
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0
ENV REACHY_API_BASE=https://pollen-robotics-reachy-mini.hf.space
ENV NEXT_PUBLIC_SITE_URL=https://pollen-robotics.com

# The standalone build ships a self-contained server.js plus the minimal
# node_modules it traced. Static assets and public/ are copied alongside.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 7860

CMD ["node", "server.js"]
