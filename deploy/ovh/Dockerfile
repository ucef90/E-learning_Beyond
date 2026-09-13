FROM node:24-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553 AS build
WORKDIR /opt/beyond
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl python3 && rm -rf /var/lib/apt/lists/*
RUN npm install --global pnpm@11.19.0
COPY . .
RUN pnpm install --frozen-lockfile
RUN DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build pnpm exec prisma generate
RUN python3 scripts/setup-lab.py
ARG SITE_URL=https://beyond-expertise.com
ARG LAB_ORIGIN=https://vps-60dc9315.vps.ovh.net
ARG API_INTERNAL_URL=http://beyond-platform-api:4300/api/v1
ARG PREPRODUCTION=false
ARG TURNSTILE_SITE_KEY=
ENV NEXT_TELEMETRY_DISABLED=1 \
    SITE_URL=${SITE_URL} \
    NEXT_PUBLIC_APP_URL=${SITE_URL} \
    NEXT_PUBLIC_LAB_ORIGIN=${LAB_ORIGIN} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${TURNSTILE_SITE_KEY} \
    API_INTERNAL_URL=${API_INTERNAL_URL} \
    PREPRODUCTION=${PREPRODUCTION}
RUN pnpm --filter @beyond/api build && pnpm --filter @beyond/web build

FROM node:24-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/beyond
COPY --from=build --chown=node:node /opt/beyond /opt/beyond
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
USER node
CMD ["node", "apps/api/dist/main.js"]
