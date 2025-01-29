import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DocumentationLayout from 'src/layout/documentation';

import { SplashScreen } from 'src/components/loading-screen';

// -------------------------------------------

const FaqsPage = lazy(() => import('src/modules/faq/list'));
const DocumentationPage = lazy(() => import('src/modules/documentation/list'));

// ----------------------------------------------------------------------

export const docRoutes = [
  {
    path: 'gbb-ai',
    element: (
      <AuthGuard>
        <DocumentationLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </DocumentationLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: 'documentation',
        children: [
          { element: <DocumentationPage />, index: true },
          { path: ':section', element: <DocumentationPage /> },
          { path: 'faqs', element: <FaqsPage /> },
        ],
      },
    ],
  },
];
