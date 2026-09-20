import '@backstage/cli/asset-types';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@backstage/ui/css/styles.css';
// Inter is the documented stand-in for SF Pro on non-Apple platforms. It's
// self-hosted rather than pulled from Google Fonts so the hardened CSP in
// app-config.yaml doesn't have to grow two external origins for a typeface.
// Only the weights the design system actually uses — the ladder is
// 300 / 400 / 600 / 700, with 500 deliberately absent.
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

ReactDOM.createRoot(document.getElementById('root')!).render(App.createRoot());
