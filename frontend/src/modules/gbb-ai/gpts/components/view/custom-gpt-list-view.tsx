import { orderBy } from 'lodash';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { NavigationLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFetchApps, deleteCustomGpt } from 'src/api/app-gallery';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import {
  MlAppStruct,
  GPT_CATEGORIES,
  ICustomGptFilters,
  ICustomGptFilterValue,
} from 'src/types/app';

import CustomGptFilters from '../custom-gpts-filters';
import CustomGptFiltersResult from '../custom-gpts-filters-result';
import { GptCategoryView } from '../custom-gpts-category-view/view';

// ----------------------------------------------------------------------

const defaultFilters: ICustomGptFilters = {
  name: '',
  categories: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Box
    sx={{
      display: 'grid',
      gap: 4,
      gridTemplateColumns: {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
    }}
  >
    {[...Array(4)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ height: 'calc(100vh - 176px)', borderRadius: 1 }}
        />
      </Grid>
    ))}
  </Box>
);

// ----------------------------------------------------------------------

export default function CustomGptListView() {
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  // const openFilters = useBoolean();

  const openDateRange = useBoolean();

  const sortBy = 'latest';

  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);

  const { apps, appsLoading, appsRefetching, refetch } = useFetchApps();

  const showingSkeleton = appsLoading || appsRefetching;

  const filteredApps = applyFilter({ apps, sortBy, filters });

  const customApps = filteredApps.filter((app) => (app.source ? app.source === 'custom' : false));

  const canReset =
    !!filters.name || !!filters.categories.length || (!!filters.startDate && !!filters.endDate);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refetch, refreshKey]);

  const handleFilters = useCallback(
    (name: string, value: ICustomGptFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setFilters]
  );

  const handleDeleteCustomGpt = useCallback(
    async (_gptId: string) => {
      if (_gptId.length === 0) return;

      try {
        const response = await deleteCustomGpt(_gptId);
        if (response?.success) {
          enqueueSnackbar('Deleted successfully');
        } else {
          enqueueSnackbar('Failed to delete', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(`Error: ${JSON.stringify(error)}`, { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      sx={{ width: '100%' }}
      spacing={1.5}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <CustomGptFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={GPT_CATEGORIES}
      />
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mb: -14 }}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" textTransform="capitalize">
          Agent store
        </Typography>

        <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            component={NavigationLink}
            path={paths.gbbai.gpts.workbench}
            startIcon={<Iconify icon="fluent:open-16-filled" width={16} />}
            sx={{ borderRadius: 0.75, px: 1.5, mr: 0 }}
          >
            Workbench
          </Button>

          <Button
            size="small"
            variant="contained"
            component={NavigationLink}
            path={paths.gbbai.gpts.create}
            startIcon={<Iconify icon={plusFill} width={18} />}
            sx={{ borderRadius: 0.75, px: 1.5, mr: 0 }}
          >
            Agent
          </Button>
        </Stack>
      </Stack>

      {showingSkeleton && SkeletonLoad}

      {!showingSkeleton && (
        <>
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
          >
            {renderFilters}

            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                sx={{
                  width: 30,
                  height: 30,
                  color: 'inherit',
                  mt: { xs: 0.5, md: 0 },
                  alignSelf: { xs: 'start', md: 'center' },
                }}
              >
                <Iconify icon={refreshFill} width={18} />
              </IconButton>
            </Tooltip>
          </Stack>

          {canReset && (
            <CustomGptFiltersResult
              filters={filters}
              onResetFilters={handleResetFilters}
              //
              canReset={canReset}
              onFilters={handleFilters}
              //
              results={filteredApps.length}
            />
          )}

          {!showingSkeleton && customApps.length > 0 && (
            <GptCategoryView
              mlApps={customApps}
              isLoading={appsLoading}
              onDelete={handleDeleteCustomGpt}
            />
          )}
        </>
      )}

      {!showingSkeleton && customApps.length === 0 && (
        <EmptyContent
          filled
          title="No Agents"
          description="Create one by clicking the + Agent button"
          imgUrl="/assets/icons/empty/ic_cart.svg"
          sx={{
            py: 1,
            borderRadius: 1,
            height: 280,
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  apps,
  sortBy,
  filters,
}: {
  apps: MlAppStruct[];
  sortBy: string;
  filters: ICustomGptFilters;
}) => {
  const { name, categories } = filters;

  if (sortBy === 'featured') {
    apps = orderBy(apps, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    apps = orderBy(apps, ['createdAt'], ['desc']);
  }

  if (name) {
    apps = apps.filter((app) => app.title.toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  if (categories.length) {
    apps = apps.filter((app) => categories.includes(app.category));
  }

  return apps;
};
