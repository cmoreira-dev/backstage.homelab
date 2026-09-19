# Multi-stage build: the whole build (yarn install, tsc, backend bundle) runs
# inside Docker, no host-side prebuild step — CI just does `docker buildx build .`
# with repo root as context, same as every other cmoreira-dev repo.
# Reference: https://backstage.io/docs/deployment/docker#multi-stage-build

# Stage 1 - Create yarn install skeleton layer
FROM node:24-trixie-slim AS packages
WORKDIR /app
COPY backstage.json package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY packages packages
COPY plugins plugins
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# Stage 2 - Install dependencies and build packages
FROM node:24-trixie-slim AS build
# python3/make/g++: node-gyp needs these to compile native deps (better-sqlite3,
# tree-sitter, cpu-features, ssh2, ...) from source when no prebuilt binary
# matches the target platform (notably linux/arm64).
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 make g++ && \
    rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /app
COPY --from=packages --chown=node:node /app .
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --immutable
COPY --chown=node:node . .
RUN yarn tsc
RUN yarn --cwd packages/backend build
RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:24-trixie-slim
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*
# TechDocs generator.runIn: 'local' (app-config.production.yaml) runs
# `mkdocs build` as a subprocess instead of spawning a Docker container —
# there's no Docker socket available in this pod. mkdocs-techdocs-core
# pulls in mkdocs + the material theme + the plugins TechDocs expects.
# --break-system-packages: Debian trixie's Python is externally-managed
# (PEP 668); this is the only thing installed into it, no conflict risk.
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip3 install --break-system-packages mkdocs-techdocs-core==1.*
# From here on we use the least-privileged `node` user to run the backend.
USER node
# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will
# fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`)
# so the app dir is correctly created as `node`.
WORKDIR /app
COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml  ./
COPY --from=build --chown=node:node /app/backstage.json ./
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"
COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./
COPY --chown=node:node app-config*.yaml ./
COPY --chown=node:node examples ./examples
COPY --chown=node:node org ./org
ENV NODE_ENV=production
EXPOSE 7007
CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
