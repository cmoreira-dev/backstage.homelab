# Architecture

## Frontend

Built on the new Backstage frontend system (`@backstage/frontend-defaults`,
`createApp`). Features are composed as plugins/modules in
`packages/app/src/App.tsx`:

- `@backstage/plugin-catalog/alpha` — the software catalog UI.
- `@backstage-community/plugin-github-actions/alpha` — CI run status per
  component. Calls `api.github.com` directly from the browser via Octokit
  (not backend-proxied), which is why `backend.csp.connect-src` has a
  scoped exception for that host.
- `./modules/auth` — overrides the `sign-in-page:app` extension to show
  only the Microsoft provider button (GitHub auth exists purely to hand
  the GitHub Actions plugin a token, it isn't a sign-in path).
- `./modules/nav`, `./modules/home` — nav sidebar and homepage layout.

## Backend

Standard `@backstage/backend-defaults` composition
(`packages/backend/src/index.ts`): catalog, scaffolder, techdocs, auth,
permission (allow-all — single-tenant homelab, any signed-in org member is
an admin), search, kubernetes, notifications/signals, and
`@backstage/plugin-mcp-actions-backend`.

### Catalog discovery

`catalog.providers.github` in `app-config.yaml` scans every repo in the
`cmoreira-dev` org for a `catalog-info.yaml` (excluding `gitops.template`)
every 30 minutes — no per-repo registration needed. Real org/team data
lives in [`org/users.yaml`](https://github.com/cmoreira-dev/backstage.homelab/blob/main/org/users.yaml)
and [`org/systems.yaml`](https://github.com/cmoreira-dev/backstage.homelab/blob/main/org/systems.yaml),
loaded as `catalog.locations` in `app-config.production.yaml`.

### Auth

Microsoft Entra ID is the only sign-in provider, `auth.environment:
production` selects the `production` keyed config. The sign-in resolver
is `emailLocalPartMatchingUserEntityName` with `allowedDomains:
[cmoreira.dev, rapporthub.pt]` — it matches the local part of the Entra
token's email claim against `User.metadata.name`, not the full address,
because the same identity can show up under either domain across logins.

### TechDocs

`techdocs.generator.runIn: 'local'` runs `mkdocs build` as a subprocess in
the backend container (no Docker socket available in-cluster). The
Dockerfile installs `mkdocs-techdocs-core` via pip for that. This is
scoped to being safe by catalog discovery only ever pointing at the
trusted `cmoreira-dev` org — see the comment in
`app-config.production.yaml` for the full trade-off.

## Deployment

Built via the multi-stage `Dockerfile` (CI pushes to ECR), deployed by
ArgoCD from `gitops.backstage.homelab`'s Helm chart, reachable through an
NGINX Gateway Fabric `HTTPRoute` + Cloudflare tunnel at
`backstage.cmoreira.dev`. Postgres (CNPG) is the catalog/auth database.
