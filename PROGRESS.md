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
- [x] 3. Border radius — pill on contained/outlined buttons + sidebar search,
      8px on the utility grammar (default button, form inputs), 18px on
      Card/Paper. Per-component overrides, no global `borderRadius`.
- [x] 4. Elevation — `boxShadow: none` on Card/Paper/AppBar (+ `backgroundImage:
      none` to kill MUI v5's overlay). Depth via surface change; the Backstage
      header takes the `sub-nav-frosted` treatment (parchment 80% +
      `saturate(180%) blur(20px)`). Backstage's gradient burst `pageTheme`s are
      flattened to solid parchment — the document forbids decorative
      gradients.
- [x] 5. Nav — `global-nav` look (black `#000`, 44px, 12px type). Done purely
      through theme overrides (`BackstageSidebar`, `BackstageSidebarItem`,
      `BackstageSidebarDivider` are all theme-overridable via
      `OverrideComponentNameToClassKeys`), so `modules/nav/Sidebar.tsx` did not
      need editing after all — tokens stay centralized in the theme file.
      Backstage's nav is a vertical drawer, so 44px maps to per-item height
      (also the document's min touch target), not bar height.
- [x] 6. Pressed state — `transform: scale(0.95)` on `MuiButton` and
      `MuiIconButton`, with a 120ms ease-out transition.
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
