import { preloadLogoPlay } from './lib/preloadLogo';

preloadLogoPlay();
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './components/AppShell.tsx';
import './index.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <AppShell />
    </BrowserRouter>
  </StrictMode>,
);
