# Apple design system restyle — progress

Source document: `DESIGN-apple.md` (repo root).

> The document describes Apple's **marketing** pages (full-bleed product tiles,
> hero photography). Backstage is a dense internal tool. We extract the visual
> language — colors, typography, radii, elevation philosophy, button grammar —
> and apply it to real Backstage patterns, not the marketing layout.

## Repo facts confirmed before starting

These differ from the original task description, verified against the tree:

- This app uses the **new frontend system** (`createApp` from
  `@backstage/frontend-defaults`). There is no `UnifiedThemeProvider` wrapper in
  `App.tsx`; themes register via `ThemeBlueprint`
  (`@backstage/plugin-app-react`) inside a `createFrontendModule`, following the
  existing `modules/{nav,home,auth}` pattern.
- There is no `packages/app/src/components/Root/Root.tsx`. The sidebar lives at
  `packages/app/src/modules/nav/Sidebar.tsx`.
- The design document is at `DESIGN-apple.md`, not
  `docs/design/apple-design-system.md`.

## Checklist

- [x] 1. `packages/app/src/theme/appleTheme.ts` — token source of truth
      (colors, radii, spacing) + `createUnifiedTheme`. No hex outside this file.
- [~] 2. Typography — Inter substitution (display tracking `-0.01em`, body
      line-height `1.44`), doc scale mapped onto MUI variants (h1–h6, body1,
      body2, button, caption, …). Scale + metrics done; Inter *delivery* still
      open (see deviations).
- [ ] 3. Border radius — pill (9999px) on primary buttons + search input,
      18px on Card/Paper, 8px on utility buttons. Per-component overrides, not
      a global `borderRadius`.
- [ ] 4. Elevation — `boxShadow: none` on Card/Paper/AppBar. Depth only via
      surface change or backdrop-blur on fixed bars.
- [ ] 5. Nav — apply the `global-nav` look (black `#000`, 44px, 12px type) to
      `modules/nav/Sidebar.tsx`.
- [ ] 6. Pressed state — `transform: scale(0.95)` on buttons, applied
      consistently.
- [x] 7. Register the theme in `App.tsx` (via `ThemeBlueprint` module — see
      repo facts above). Registered as `light` under `pluginId: 'app'`, which
      overrides the built-in `theme:app/light` so the restyle is the default
      rather than an opt-in entry in the theme picker.

## Commit log

Each checklist item gets its own small commit. Order: theme base → nav →
buttons → cards → global typography.

## Open questions / deviations

- **Inter delivery.** The doc names Google Fonts. This app ships a deliberately
  hardened CSP (`app-config.yaml`), so pulling `fonts.googleapis.com` +
  `fonts.gstatic.com` would mean widening it. The font stack leads with
  `system-ui, -apple-system, BlinkMacSystemFont` anyway (real SF Pro on
  Apple devices, per the doc's own substitution note), so Inter only matters on
  non-Apple platforms. Decision pending at the typography step — see item 2.
