import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// project import
import ExceptionLayout from 'src/layout/exception';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/modules/general/404'));

// ----------------------------------------------------------------------

export const exceptionRoutes = [
  {
    element: (
      <ExceptionLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </ExceptionLayout>
    ),
    children: [{ path: '404', element: <Page404 /> }],
  },
];
