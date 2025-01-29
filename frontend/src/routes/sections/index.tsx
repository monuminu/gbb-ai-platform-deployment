import { Navigate, useRoutes } from 'react-router-dom';

import { DEFAULT_PATH } from 'src/config-global';

import { authRoutes } from './auth';
import { gbbaiRoutes } from './gbb-ai';
import { docRoutes } from './documentation';
import { exceptionRoutes } from './exception';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = [
    {
      path: '/',
      element: <Navigate to={DEFAULT_PATH} replace />,
    },
    ...authRoutes,
    ...gbbaiRoutes,
    ...exceptionRoutes,
    ...docRoutes,
    { path: '*', element: <Navigate to="/404" replace /> },
  ];

  return useRoutes(routes);
}
