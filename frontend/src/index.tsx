import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { PublicClientApplication } from '@azure/msal-browser';

import Router from 'src/routes/sections';

import 'src/index.css';
import 'src/locales/i18n';
import { AuthProvider } from 'src/auth/ad';
import ThemeCustomization from 'src/custom';
import { LocaleProvider } from 'src/locales';

import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsContextProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';

// ----------------------------------------------------------------------

// export const msalInstance = new PublicClientApplication(msalConfig);

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <LocaleProvider>
            <SettingsContextProvider>
              <ThemeCustomization>
                <MotionLazy>
                  <SnackbarProvider>
                    <Router />
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeCustomization>
            </SettingsContextProvider>
          </LocaleProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
