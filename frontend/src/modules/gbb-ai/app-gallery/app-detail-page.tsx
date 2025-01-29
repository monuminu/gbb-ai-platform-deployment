import { Helmet } from 'react-helmet-async';

import { Grid, Skeleton, Container } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useFetchApps } from 'src/api/app-gallery';

import { useSettingsContext } from 'src/components/settings';

import {
  AiDataAnalyzer,
  CustomGptsWorkbench,
  ManufacturingCopilot,
  EnterpriseDataCopilot,
} from './components/apps';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={2} sx={{ px: 3 }}>
    <Grid item xs={12}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={110}
        sx={{ borderRadius: 2, mt: 0.5, mb: 3, px: 8 }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height="calc(100vh - 320px)"
        sx={{ borderRadius: 2, mt: 0.5, mb: 3, px: 8 }}
      />
    </Grid>
  </Grid>
);

// ----------------------------------------------------------------------

export default function AppPage() {
  const params = useParams();

  const { id } = params;

  const settings = useSettingsContext();
  const { apps, appsLoading } = useFetchApps();

  const app = apps.find((_app) => _app.id === id);
  const customGpts = apps
    .filter((_app) => _app.source === 'custom')
    .map((_app) => ({
      ...(_app.content && JSON.parse(_app.content)),
      coverUrl: _app.cover,
      category: _app.category,
    }));

  return (
    <>
      <Helmet>
        <title> GBB/AI: App Gallery</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
        {appsLoading && SkeletonLoad}

        {!appsLoading && (
          <>
            {app &&
              app.source === 'built-in' &&
              (app.title.toLowerCase().includes('data copilot') ||
                app.title.toLowerCase().includes('aoai workbench')) && (
                <EnterpriseDataCopilot mlApp={app} />
              )}

            {app &&
              app.source === 'built-in' &&
              app.title.toLowerCase().includes('custom gpts') && (
                <CustomGptsWorkbench id={app.id} customGpts={customGpts} />
              )}
            {app &&
              app.source === 'built-in' &&
              app.title.toLowerCase().includes('manufacturing') && (
                <ManufacturingCopilot mlApp={app} />
              )}
            {app &&
              app.source === 'built-in' &&
              app.title.toLowerCase().includes('ai data analyzer') && (
                <AiDataAnalyzer mlApp={app} />
              )}
          </>
        )}
      </Container>
    </>
  );
}
