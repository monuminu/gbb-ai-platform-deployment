import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import KbManagerList from './components/kb-manager-list';

// ----------------------------------------------------------------------

export default function KbPage() {
  const { t } = useTranslate();

  const [refreshKey, setRefreshKey] = useState(0);

  const settings = useSettingsContext();

  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  return (
    <>
      <Helmet>
        <title> GBB/AI: KMM</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack sx={{ mb: 2.5 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" textTransform="capitalize">
            {t('knowledge_base')}
          </Typography>
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ width: 32, height: 32, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
        </Stack>

        <KbManagerList refreshKey={refreshKey} onRefresh={handleRefresh} />
      </Container>
    </>
  );
}
