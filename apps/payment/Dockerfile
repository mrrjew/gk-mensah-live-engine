FROM node:20-alpine AS builder
WORKDIR /workspace

RUN apk add --no-cache python3 make g++
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs
COPY proto ./proto
COPY drizzle ./drizzle
COPY drizzle.config.js ./

RUN pnpm install --frozen-lockfile
RUN pnpm build payment
RUN pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/package.json ./package.json
COPY --from=builder /workspace/proto ./proto
COPY --from=builder /workspace/dist/apps/payment ./dist/apps/payment

EXPOSE 4002 3002

CMD ["node", "dist/apps/payment/main.js"]
