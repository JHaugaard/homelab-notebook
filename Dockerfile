# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose dev server port
EXPOSE 5173

# Start development server with host binding
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build-time env vars for SvelteKit static imports
ARG PUBLIC_POCKETBASE_URL=https://pocketbase.haugaard.dev
ENV PUBLIC_POCKETBASE_URL=$PUBLIC_POCKETBASE_URL

RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only production dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/build ./build

# Expose production port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Start production server
CMD ["node", "build"]
