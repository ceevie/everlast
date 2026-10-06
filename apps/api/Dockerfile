FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @everlast/types build
RUN pnpm --filter @everlast/prisma generate
RUN pnpm --filter @everlast/prisma build
RUN pnpm --filter api build

CMD ["sh", "-c", "pnpm --filter @everlast/prisma db:push && node apps/api/dist/main.js"]
