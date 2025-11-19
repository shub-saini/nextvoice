# Build it with: docker build --build-arg APP_NAME=web -t myapp-web .

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY .npmrc* ./
COPY turbo.json ./
COPY package.json pnpm-lock.yaml ./

# Copy all workspace packages
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install ALL dependencies (this ensures everything is available)
RUN pnpm install --shamefully-hoist

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy everything from deps
COPY --from=deps /app ./

# Build the specific app
RUN pnpm turbo build --filter=${APP_NAME}

# Production image
FROM base AS runner
WORKDIR /app

ARG APP_NAME
ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for standalone
COPY --from=builder /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]