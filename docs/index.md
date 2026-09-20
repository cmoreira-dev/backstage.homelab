# backstage.homelab

Internal developer portal for the `cmoreira-dev` homelab, deployed at
[backstage.cmoreira.dev](https://backstage.cmoreira.dev).

It's the single entry point for the software catalog, API docs, and these
TechDocs pages across every repo in the `cmoreira-dev` GitHub org.

## What it does

- **Software catalog** — every repo's `catalog-info.yaml` is discovered
  automatically (org-wide, no manual registration) and rendered as a
  Component, API, or System, with ownership and relations between them.
- **TechDocs** — this page is an example: any repo with a `mkdocs.yml` and
  a `backstage.io/techdocs-ref` annotation in its `catalog-info.yaml` gets
  its docs built and served here.
- **GitHub Actions** — CI runs for a component's repo are visible from its
  catalog page.
- **Sign-in** — Microsoft Entra ID (cmoreira-dev tenant) is the only
  sign-in provider; see [Sign-in & Catalog](onboarding.md).

## Related repos

- [`gitops.backstage.homelab`](https://github.com/cmoreira-dev/gitops.backstage.homelab) —
  Helm chart and ArgoCD Application that deploy this portal.
- [`gitops.core-addons`](https://github.com/cmoreira-dev/gitops.core-addons) —
  provides the NGINX Gateway Fabric route, cloudflared ingress, and
  ExternalSecrets this app depends on.

See [Architecture](architecture.md) for how the pieces fit together.
