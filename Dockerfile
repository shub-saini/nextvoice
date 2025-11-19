# Simple Node.js Dockerfile - NO BUILD, just run dev mode!
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy everything
COPY . .

# Install dependencies
RUN pnpm install

# Expose ports for both apps
EXPOSE 3000 3001

# Start both apps
CMD pnpm dev