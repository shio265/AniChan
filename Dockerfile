FROM oven/bun:1.3.14 AS builder

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY src ./src
RUN bun run typecheck
RUN bun run build

FROM oven/bun:1.3.14-distroless AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/build/bot ./bot
COPY --from=builder /app/src/queries ./queries

ENTRYPOINT []
CMD ["/app/bot"]
