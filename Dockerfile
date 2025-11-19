# Build it with: docker build --build-arg APP_NAME=web -t myapp-web .

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY package.json pnpm-lock.yaml ./

# Copy ALL package.json files from workspace
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install dependencies with frozen lockfile
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy all source code
COPY . .

# Build the specific app using turbo
RUN pnpm turbo build --filter=${APP_NAME}

# Production image
FROM base AS runner
WORKDIR /app

ARG APP_NAME
ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD node apps/${APP_NAME}/server.js