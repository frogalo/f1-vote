# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install required packages including openssl for Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package.json and install dependencies securely using npm ci
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Provide a dummy DATABASE_URL for the build step so Next.js can pre-render
# Server Components without failing. The real URL is injected at runtime.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG POSTGRES_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
ENV POSTGRES_URL=${POSTGRES_URL}

# Build Next.js application
RUN npm run build

# Production image, copy all the necessary files and run next
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3009

# Create non-root user/group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy over package files, configs, and built assets
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Ensure the uploads directory exists and is writable by the Next.js user
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3009

CMD ["npm", "start"]

