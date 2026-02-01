# SkillMatch Backend Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Development image
FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]

# Production image
FROM base AS production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER expressjs

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["node", "src/server.js"]
