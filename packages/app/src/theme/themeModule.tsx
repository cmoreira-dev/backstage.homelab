import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { ThemeBlueprint } from '@backstage/plugin-app-react';
import { UnifiedThemeProvider } from '@backstage/theme';
import LightIcon from '@material-ui/icons/WbSunny';
import { appleTheme } from './appleTheme';

/**
 * Registered as `light` under the `app` plugin, which overrides Backstage's
 * built-in `theme:app/light` rather than adding a third entry to the theme
 * picker — the restyle is meant to be what the app looks like, not an opt-in.
 * The stock dark theme is left untouched; DESIGN-apple.md documents the
 * light-dominant system only.
 */
const appleLightTheme = ThemeBlueprint.make({
  name: 'light',
  params: {
    theme: {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={appleTheme}>
          {children}
        </UnifiedThemeProvider>
      ),
    },
  },
});

export const themeModule = createFrontendModule({
  pluginId: 'app',
  extensions: [appleLightTheme],
});
