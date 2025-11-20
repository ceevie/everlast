FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Pnpm über Corepack installieren
RUN corepack enable

# Copy workspace config
COPY package.json pnpm-workspace.yaml ./

# Copy packages
COPY apps/api ./apps/api
COPY packages/prisma ./packages/prisma
COPY packages/types ./packages/types

#Dependencies installieren (wird sauber gecached)
RUN pnpm install

# Generate Prisma Client and Build Package
WORKDIR /app/packages/prisma
RUN pnpm run generate
RUN pnpm run build

# Build API
WORKDIR /app/apps/api
RUN pnpm run build

# Start
CMD ["sh", "-c", "cd /app/packages/prisma && npx prisma db push && npx prisma db seed && cd /app/apps/api && node dist/main"]

