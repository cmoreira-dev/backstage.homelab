import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';

// Overrides the default (guest-only) sign-in page — see
// app-config.production.yaml's auth.providers for the matching backend
// provider config.
const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => (
      <SignInPage
        {...props}
        providers={[
          {
            id: 'microsoft',
            title: 'Microsoft Entra ID',
            message: 'Sign in with your cmoreira-dev organization account',
            apiRef: microsoftAuthApiRef,
          },
        ]}
      />
    ),
  },
});

export const authModule = createFrontendModule({
  pluginId: 'app',
  extensions: [signInPage],
});
