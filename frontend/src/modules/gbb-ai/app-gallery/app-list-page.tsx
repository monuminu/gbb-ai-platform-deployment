import { isEqual, orderBy } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useFetchApps } from 'src/api/app-gallery';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { MlAppStruct, AppFilterStruct, AppFilterValueStruct } from 'src/types/app';

import AppList from './components/app-list';
import AppFiltersResult from './components/app-filter-result';
import AppFilterSidebar from './components/app-filter-sidebar';

// ----------------------------------------------------------------------

const defaultFilters: AppFilterStruct = {
  scenario: [],
  category: 'All',
  colors: [],
  priceRange: '',
  rating: '',
};

// ----------------------------------------------------------------------

export default function AppGalleryPage() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const sortBy = 'latest';

  const [filters, setFilters] = useState(defaultFilters);

  const { apps, appsEmpty, appsLoading } = useFetchApps();

  const filteredApps = applyFilter({ apps, sortBy, filters });

  const builtInApps = filteredApps.filter((app) => (app.source ? app.source === 'built-in' : true));

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !filteredApps.length && canReset;

  const handleFilters = useCallback((name: string, value: AppFilterValueStruct) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;
  return (
    <>
      <Helmet>
        <title> GBB/AI: App Gallery</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'} sx={{ mb: -6 }}>
        <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" textTransform="capitalize">
            {t('applications')}
          </Typography>

          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <AppFilterSidebar
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              //
              filters={filters}
              onFilters={handleFilters}
              //
              canReset={canReset}
              onResetFilters={handleResetFilters}
            />
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={() => {}}
                sx={{ width: 32, height: 32, color: 'inherit' }}
              >
                <Iconify icon={refreshFill} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {canReset && (
          <AppFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            //
            results={filteredApps.length}
          />
        )}

        {!appsLoading && (notFound || appsEmpty) && renderNotFound}

        <AppList mlApps={builtInApps} isLoad={appsLoading} />
      </Container>
    </>
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
  filters: AppFilterStruct;
}) => {
  const { scenario, category } = filters;

  if (sortBy === 'featured') {
    apps = orderBy(apps, ['sold'], ['desc']);
  }

  if (sortBy === 'newest') {
    apps = orderBy(apps, ['createdAt'], ['desc']);
  }

  if (scenario.length > 0) {
    apps = apps.filter((app) => scenario.includes(app.scenario));
  }

  if (category !== 'All') {
    apps = apps.filter((app) => app.category === category);
  }

  return apps;
};
