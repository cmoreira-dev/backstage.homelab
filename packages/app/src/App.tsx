import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
// Renders the consent popup an MCP client triggers when it requests a token
// via Client ID Metadata Documents (see auth.clientIdMetadataDocuments in
// app-config.yaml) — not a sign-in path itself.
import mcpAuthPlugin from '@backstage/plugin-auth';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';
import { authModule } from './modules/auth';
import { themeModule } from './theme';

export default createApp({
  features: [catalogPlugin, techdocsPlugin, githubActionsPlugin, mcpAuthPlugin, navModule, homeModule, authModule, themeModule],
});
