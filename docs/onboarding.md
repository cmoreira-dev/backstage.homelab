# Sign-in & Catalog onboarding

## Signing in

Sign-in is Microsoft Entra ID only (the `cmoreira-dev` tenant App
Registration). For a new person to sign in, add a `User` entity to
[`org/users.yaml`](https://github.com/cmoreira-dev/backstage.homelab/blob/main/org/users.yaml)
whose `metadata.name` matches the local part of their email (the part
before `@`) — the sign-in resolver matches on that, not the full address,
across any of the `allowedDomains` configured in
`app-config.production.yaml`.

## Adding a repo to the catalog

Nothing to register manually — `catalog.providers.github` discovers any
repo in the `cmoreira-dev` org with a `catalog-info.yaml` at its root
within 30 minutes. To onboard a new repo:

1. Add a `catalog-info.yaml` at the repo root (`Component`, and `API` if
   it exposes one — see any `api.ia.*` repo for the pattern of a
   committed `openapi.yaml` referenced via `$text: ./openapi.yaml`).
2. Set `spec.owner` and `spec.system` to match an existing `Group`/`System`
   in `org/users.yaml` / `org/systems.yaml`, or add a new one there.
3. For TechDocs, add a `mkdocs.yml` (see this repo's for a minimal
   example) with a `docs/` folder, and the
   `backstage.io/techdocs-ref: dir:.` annotation on the `Component`.

No image rebuild or redeploy of this portal is needed for any of the
above — the catalog provider and TechDocs generator both pick up new
repos/docs on their own schedule.
