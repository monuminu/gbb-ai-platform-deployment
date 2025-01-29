import { Grid, Skeleton, Container } from '@mui/material';

import { useFetchApps } from 'src/api/app-gallery';

import { useSettingsContext } from 'src/components/settings';

import CustomGptEntry from '../custom-gpts/custom-gpt-entry';

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

type Props = {
  id: string;
};

export default function CustomGptDetailsPage({ id }: Props) {
  const settings = useSettingsContext();
  const { apps, appsLoading } = useFetchApps();

  const app = apps.find((_app) => _app.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      {appsLoading && SkeletonLoad}

      {!appsLoading && (
        <>
          {app && app.source === 'custom' && (
            <CustomGptEntry title={app.title} gptContent={app.content} coverUrl={app.cover} />
          )}
        </>
      )}
    </Container>
  );
}
