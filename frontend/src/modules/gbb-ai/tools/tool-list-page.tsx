import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ToolRegistry from './components/tool-registry';

// ----------------------------------------------------------------------

export default function ToolListPage() {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  return (
    <>
      <Helmet>
        <title> GBB/AI: Tools</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack sx={{ mb: 2.5 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" textTransform="capitalize">
            {t('tools')}
          </Typography>
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ width: 32, height: 32, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
        </Stack>

        <ToolRegistry refreshKey={refreshKey} />
      </Container>
    </>
  );
}
