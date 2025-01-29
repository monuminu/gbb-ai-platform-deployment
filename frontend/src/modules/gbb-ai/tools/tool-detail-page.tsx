import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import { useParams } from 'src/routes/hooks';

import { useFetchTool } from 'src/api/tool';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import ToolDetailEntry from './components/tool-detail-entry';

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

export default function ToolDetailsPage() {
  const settings = useSettingsContext();

  const [refreshKey, setRefreshKey] = useState(0);

  const params = useParams();

  const { id } = params;

  const { tool: currentTool, refetch, toolLoading, toolRefetching } = useFetchTool(id || '');

  // const currentTool = tools.find((_tool) => _tool.id === id);

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refetch, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  return (
    <>
      <Helmet>
        <title> GBB/AI: Tool Details</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {(toolLoading || toolRefetching) && SkeletonLoad}

        {!toolLoading && !toolRefetching && !currentTool && (
          <EmptyContent filled title="No Information" sx={{ py: 8, m: 3 }} />
        )}

        {!toolLoading && !toolRefetching && currentTool && (
          <ToolDetailEntry currentTool={currentTool} onRefresh={handleRefresh} />
        )}
      </Container>
    </>
  );
}
