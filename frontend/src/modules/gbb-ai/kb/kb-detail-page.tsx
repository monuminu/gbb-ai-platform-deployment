import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import plusFill from '@iconify/icons-eva/plus-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFetchKbMeta } from 'src/api/kmm';

import Iconify from 'src/components/iconify';
import { SkeletonChartTable } from 'src/components/skeleton';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KbDetailsTable from './components/kb-details-top-table';
import KbManagerRoot from './components/kn-kb/file-manager-root';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Skeleton variant="text" width={100} height={56} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="text" width={300} height={42} sx={{ mt: -3.5 }} />
    </Grid>
    <Grid item xs={12}>
      <SkeletonChartTable rowNumber={1} />
    </Grid>
    <Grid item xs={12}>
      <SkeletonChartTable rowNumber={8} />
    </Grid>
  </Grid>
);

// ----------------------------------------------------------------------

export default function KbDetailsPage() {
  const params = useParams();

  const { id } = params;

  const settings = useSettingsContext();

  const upload = useBoolean();

  const [refreshKey, setRefreshKey] = useState(0);

  const { kbMeta, isLoading } = useFetchKbMeta(id, refreshKey);

  const handleRefresh = () => {
    setRefreshKey(Math.floor(Math.random() * 1000));
  };

  return (
    <>
      <Helmet>
        <title> GBB/AI: KMM Detail</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        {isLoading && SkeletonLoad}
        {!isLoading && kbMeta && (
          <>
            <Stack
              sx={{ mb: 3 }}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h4">{kbMeta.name}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  sx={{ width: 30, height: 30, color: 'inherit' }}
                >
                  <Iconify icon={refreshFill} />
                </IconButton>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Icon icon={plusFill} />}
                  onClick={upload.onTrue}
                >
                  Source
                </Button>
              </Stack>
            </Stack>
            <CustomBreadcrumbs
              links={[
                {
                  name: 'Knowledge base',
                  href: paths.gbbai.kb.root,
                },
                { name: kbMeta.name },
              ]}
              sx={{ mb: { xs: 2, md: 3 }, mt: { xs: -1.5, md: -2 } }}
            />

            <Stack spacing={2}>
              <KbDetailsTable kb={kbMeta} />

              {/* {kbMeta.type.toLowerCase() === 'qa' && <QaDataTable />} */}

              {kbMeta.type.toLowerCase() === 'kb' && (
                <KbManagerRoot
                  kbMeta={kbMeta}
                  refreshKey={refreshKey}
                  openUpload={upload.value}
                  onCloseUpload={upload.onFalse}
                />
              )}
            </Stack>
          </>
        )}
      </Container>
    </>
  );
}
