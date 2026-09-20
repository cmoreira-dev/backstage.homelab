import {
  createUnifiedTheme,
  palettes,
  type UnifiedTheme,
} from '@backstage/theme';

/**
 * Single source of truth for the design tokens in DESIGN-apple.md. Every hex,
 * radius and spacing step used by the app originates here — nothing downstream
 * should inline a literal.
 */
export const colors = {
  primary: '#0066cc',
  primaryFocus: '#0071e3',
  primaryOnDark: '#2997ff',
  ink: '#1d1d1f',
  bodyOnDark: '#ffffff',
  bodyMuted: '#cccccc',
  inkMuted80: '#333333',
  inkMuted48: '#7a7a7a',
  dividerSoft: '#f0f0f0',
  hairline: '#e0e0e0',
  canvas: '#ffffff',
  canvasParchment: '#f5f5f7',
  surfacePearl: '#fafafc',
  surfaceTile1: '#272729',
  surfaceTile2: '#2a2a2c',
  surfaceTile3: '#252527',
  surfaceBlack: '#000000',
  surfaceChipTranslucent: '#d2d2d7',
  onPrimary: '#ffffff',
  onDark: '#ffffff',
} as const;

export const radii = {
  none: 0,
  xs: 5,
  sm: 8,
  md: 11,
  lg: 18,
  pill: 9999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 17,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 80,
} as const;

/**
 * The document specifies SF Pro Display/Text, which ships only on Apple
 * platforms. Per its own substitution note the stack leads with `system-ui` /
 * `-apple-system` so macOS, iOS and Safari resolve the real SF Pro, and falls
 * back to Inter elsewhere.
 */
export const fontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif";

/**
 * Inter runs slightly wider than SF Pro, so the substitution note calls for
 * tightening display tracking by -0.01em and pulling body leading from 1.47 to
 * 1.44. Both adjustments are applied as the shipped values rather than as a
 * conditional, since the two faces are close enough that one set of metrics
 * reads correctly on either.
 */
const displayTracking = '-0.01em';
const bodyLineHeight = 1.44;

/** The system-wide press micro-interaction, applied to every button. */
export const pressedScale = 0.95;

/**
 * Document scale → MUI variant. The document's token names are kept in comments
 * so the mapping stays auditable against DESIGN-apple.md.
 */
const typeScale = {
  h1: { fontSize: 56, fontWeight: 600, lineHeight: 1.07 }, // hero-display
  h2: { fontSize: 40, fontWeight: 600, lineHeight: 1.1 }, // display-lg
  h3: { fontSize: 34, fontWeight: 600, lineHeight: 1.47 }, // display-md
  h4: { fontSize: 28, fontWeight: 400, lineHeight: 1.14 }, // lead
  h5: { fontSize: 24, fontWeight: 300, lineHeight: 1.5 }, // lead-airy
  h6: { fontSize: 21, fontWeight: 600, lineHeight: 1.19 }, // tagline
} as const;

/** `nav-link` — 12px, used by the sidebar and any other nav chrome. */
const navLink = {
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.0,
  letterSpacing: '-0.12px',
} as const;

const bodyScale = {
  subtitle1: { fontSize: 17, fontWeight: 600, lineHeight: 1.24, letterSpacing: '-0.374px' }, // body-strong
  body1: { fontSize: 17, fontWeight: 400, lineHeight: bodyLineHeight, letterSpacing: '-0.374px' }, // body
  subtitle2: { fontSize: 14, fontWeight: 600, lineHeight: 1.29, letterSpacing: '-0.224px' }, // caption-strong
  body2: { fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '-0.224px' }, // caption
  button: { fontSize: 14, fontWeight: 400, lineHeight: 1.29, letterSpacing: '-0.224px' }, // button-utility
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.12px' }, // fine-print
  overline: { ...navLink, textTransform: 'none' as const }, // nav-link
};

/**
 * `BackstageTypography` only carries size/weight/margin, so the per-variant
 * line-height and tracking land in MuiTypography overrides below.
 */
const typographyVariantOverrides = {
  ...Object.fromEntries(
    Object.entries(typeScale).map(([variant, spec]) => [
      variant,
      { lineHeight: spec.lineHeight, letterSpacing: displayTracking },
    ]),
  ),
  ...bodyScale,
};

export const appleTheme: UnifiedTheme = createUnifiedTheme({
  palette: {
    ...palettes.light,
    primary: { main: colors.primary, dark: colors.primaryFocus, contrastText: colors.onPrimary },
    secondary: { main: colors.primary, contrastText: colors.onPrimary },
    text: {
      primary: colors.ink,
      secondary: colors.inkMuted80,
      disabled: colors.inkMuted48,
    },
    background: {
      default: colors.canvasParchment,
      paper: colors.canvas,
    },
    divider: colors.hairline,
    // The document's nav is the one place true black appears.
    navigation: {
      ...palettes.light.navigation,
      background: colors.surfaceBlack,
      color: colors.bodyMuted,
      indicator: colors.primary,
      selectedColor: colors.onDark,
      navItem: { hoverBackground: colors.surfaceTile1 },
    },
  },
  fontFamily,
  typography: {
    htmlFontSize: 16,
    fontFamily,
    ...Object.fromEntries(
      Object.entries(typeScale).map(([variant, spec]) => [
        variant,
        { fontSize: spec.fontSize, fontWeight: spec.fontWeight, marginBottom: spacing.xs },
      ]),
    ),
  } as Parameters<typeof createUnifiedTheme>[0]['typography'],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily,
          fontSize: bodyScale.body1.fontSize,
          lineHeight: bodyLineHeight,
          letterSpacing: bodyScale.body1.letterSpacing,
          color: colors.ink,
          backgroundColor: colors.canvasParchment,
        },
      },
    },
    MuiTypography: {
      styleOverrides: typographyVariantOverrides,
    },

    MuiButton: {
      defaultProps: {
        // Elevation is never decorative in this system; a raised button would
        // be the one shadow the document explicitly forbids.
        disableElevation: true,
      },
      styleOverrides: {
        // Utility grammar is the default: 8px, 14px `button-utility` type.
        // The pill is reserved for the prominent actions below, so it keeps
        // meaning something.
        root: {
          borderRadius: radii.sm,
          textTransform: 'none',
          fontFamily,
          fontSize: bodyScale.button.fontSize,
          fontWeight: bodyScale.button.fontWeight,
          lineHeight: bodyScale.button.lineHeight,
          letterSpacing: bodyScale.button.letterSpacing,
          padding: `${spacing.xs}px ${spacing.sm + 3}px`,
          boxShadow: 'none',
          transition: 'transform 120ms ease-out, background-color 120ms ease-out',
          // The system-wide micro-interaction — every button presses inward.
          '&:active': {
            transform: `scale(${pressedScale})`,
          },
          '&:focus-visible': {
            outline: `2px solid ${colors.primaryFocus}`,
            outlineOffset: 2,
          },
          '&:hover': {
            boxShadow: 'none',
          },
        },
        // `button-primary` — the signature Action Blue pill.
        contained: {
          borderRadius: radii.pill,
          fontSize: bodyScale.body1.fontSize,
          lineHeight: bodyScale.body1.lineHeight,
          letterSpacing: bodyScale.body1.letterSpacing,
          padding: `11px ${spacing.lg - 2}px`,
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: colors.onPrimary,
        },
        // `button-secondary-pill` — the ghost pill that partners the blue one.
        outlined: {
          borderRadius: radii.pill,
          fontSize: bodyScale.body1.fontSize,
          lineHeight: bodyScale.body1.lineHeight,
          letterSpacing: bodyScale.body1.letterSpacing,
          padding: `11px ${spacing.lg - 2}px`,
        },
        outlinedPrimary: {
          borderColor: colors.primary,
          color: colors.primary,
        },
        // `text-link` — inline actions carry the accent and no chrome.
        text: {
          color: colors.primary,
        },
      },
    },

    // `button-icon-circular` — 44px is both the documented size and the
    // system's minimum touch target.
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 44,
          height: 44,
          borderRadius: radii.pill,
          transition: 'transform 120ms ease-out',
          '&:active': {
            transform: `scale(${pressedScale})`,
          },
          '&:focus-visible': {
            outline: `2px solid ${colors.primaryFocus}`,
            outlineOffset: 2,
          },
        },
      },
    },

    // The document's `global-nav` is a 44px horizontal black bar. Backstage's
    // nav is a vertical drawer, so the 44px carries over as the per-item height
    // (which is also the document's minimum touch target) rather than as the
    // height of the bar itself. Black surface and 12px `nav-link` type do
    // transfer literally.
    BackstageSidebar: {
      styleOverrides: {
        drawer: {
          backgroundColor: colors.surfaceBlack,
          borderRight: 'none',
        },
        drawerOpen: {
          backgroundColor: colors.surfaceBlack,
        },
      },
    },
    BackstageSidebarItem: {
      styleOverrides: {
        root: {
          height: 44,
          color: colors.bodyMuted,
        },
        label: {
          fontFamily,
          fontSize: navLink.fontSize,
          fontWeight: navLink.fontWeight,
          lineHeight: navLink.lineHeight,
          letterSpacing: navLink.letterSpacing,
          textTransform: 'none',
        },
        selected: {
          color: colors.onDark,
          borderLeftColor: colors.primary,
        },
        highlighted: {
          backgroundColor: colors.surfaceTile1,
        },
        iconContainer: {
          color: 'inherit',
        },
        // `search-input` — the pill is the document's "this is an action"
        // signal, and search is the one input it documents. Ordinary form
        // fields keep the utility radius below, so the pill stays meaningful.
        searchRoot: {
          borderRadius: radii.pill,
          backgroundColor: colors.surfaceTile1,
        },
        searchField: {
          fontFamily,
          fontSize: bodyScale.body2.fontSize,
          letterSpacing: bodyScale.body2.letterSpacing,
          color: colors.onDark,
        },
      },
    },

    // Form inputs sit in the utility grammar, not the pill one — the document
    // only ever pills the search field, and a dense internal tool is mostly
    // forms.
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
        },
        multiline: {
          borderRadius: radii.sm,
        },
      },
    },
    BackstageSidebarDivider: {
      styleOverrides: {
        root: {
          // A hairline that reads on black without becoming a drawn line —
          // the document divides by surface step, not by stroke.
          backgroundColor: colors.surfaceTile2,
        },
      },
    },
  },
});
