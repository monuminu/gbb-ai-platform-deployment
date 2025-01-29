import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import ADLayout from 'src/layout/auth/auth-layout';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const ADLoginPage = lazy(() => import('src/modules/ad/login'));

// ----------------------------------------------------------------------

const authAd = {
  path: 'ad',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <ADLayout>
          <ADLoginPage />
        </ADLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authAd],
  },
];
