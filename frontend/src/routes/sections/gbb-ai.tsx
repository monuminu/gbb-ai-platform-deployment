import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import GbbAiLayout from 'src/layout/gbbai';

import { LoadingDisplay } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// TOOL
const ToolListPage = lazy(() => import('src/modules/gbb-ai/tools/tool-list-page'));
const ToolDetailPage = lazy(() => import('src/modules/gbb-ai/tools/tool-detail-page'));
// KB
const KbPage = lazy(() => import('src/modules/gbb-ai/kb/kb-list-page'));
const KbDetailPage = lazy(() => import('src/modules/gbb-ai/kb/kb-detail-page'));
// APP GALLERY
const AppGalleryPage = lazy(() => import('src/modules/gbb-ai/app-gallery/app-list-page'));
const AppGalleryAppPage = lazy(() => import('src/modules/gbb-ai/app-gallery/app-detail-page'));
// AGENT
const GptsPage = lazy(() => import('src/modules/gbb-ai/gpts/agent-list-page'));
const CustomGptPage = lazy(() => import('src/modules/gbb-ai/gpts/agent-detail-page'));
const CustomGptWorkbencgPage = lazy(() => import('src/modules/gbb-ai/gpts/agent-workbench'));
const CustomGptCreateEditPage = lazy(() => import('src/modules/gbb-ai/gpts/agent-create-edit'));
// USER
const UserAccountPage = lazy(() => import('src/modules/gbb-ai/user/account'));

// ----------------------------------------------------------------------

export const gbbaiRoutes = [
  {
    path: 'gbb-ai',
    element: (
      <AuthGuard>
        <GbbAiLayout>
          <Suspense fallback={<LoadingDisplay />}>
            <Outlet />
          </Suspense>
        </GbbAiLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: 'app-gallery',
        children: [
          { element: <AppGalleryPage />, index: true },
          { path: 'list', element: <AppGalleryPage /> },
          { path: ':id', element: <AppGalleryAppPage /> },
          { path: ':id/edit', element: <AppGalleryAppPage /> },
        ],
      },
      {
        path: 'gpts',
        children: [
          { element: <GptsPage />, index: true },
          { path: 'list', element: <GptsPage /> },
          { path: ':id', element: <CustomGptPage /> },
          { path: 'create', element: <CustomGptCreateEditPage /> },
          { path: 'workbench', element: <CustomGptWorkbencgPage /> },
          { path: 'edit/:id', element: <CustomGptCreateEditPage /> },
        ],
      },
      {
        path: 'function',
        children: [
          { element: <ToolListPage />, index: true },
          { path: 'list', element: <ToolListPage /> },
          { path: ':id', element: <ToolDetailPage /> },
        ],
      },
      {
        path: 'kb',
        children: [
          { element: <KbPage />, index: true },
          { path: 'list', element: <KbPage /> },
          { path: ':id', element: <KbDetailPage /> },
          { path: ':id/edit', element: <KbDetailPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserAccountPage />, index: true },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
    ],
  },
];
