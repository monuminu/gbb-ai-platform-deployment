import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { ComingSoonImage } from 'src/assets';

import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountAoai from './components/account-aoai';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'aoai',
    label: 'AOAI',
    icon: <SvgColor src="/assets/icons/account/ic_aoai.svg" sx={{ width: 24 }} />,
  },
  {
    value: 'ai_search',
    label: 'AI Search',
    icon: <SvgColor src="/assets/icons/account/ic_ai_search.svg" sx={{ width: 24 }} />,
  },
  {
    value: 'social',
    label: 'Cosmos DB',
    icon: <SvgColor src="/assets/icons/account/ic_cosmos_db.svg" sx={{ width: 24 }} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountPage() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('aoai');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const comeSoonContent = (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h4" sx={{ my: 1 }}>
        Coming soon
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>We are currently working on this</Typography>

      <ComingSoonImage sx={{ my: 6, height: 220 }} />
    </Stack>
  );
  return (
    <>
      <Helmet>
        <title> Dashboard: Account Settings</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            // { name: 'GBB-AI', href: paths.gbbai.root },
            { name: 'User', href: paths.gbbai.user.root },
            { name: 'Account' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />

        <Alert variant="outlined" severity="info" sx={{ mb: 3, alignItems: 'center' }}>
          <Box sx={{ mb: 1 }}>
            1. Your credentials will be stored only in the <strong>LOCAL</strong> storage of your
            web browser. They will be removed from local storage once you log out.
          </Box>
          <Box>
            2. You can download the credential file to your local disk and import it the next time
            you log in.
          </Box>
        </Alert>

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'aoai' && <AccountAoai />}

        {currentTab === 'ai_search' && comeSoonContent}

        {currentTab === 'social' && comeSoonContent}
      </Container>
    </>
  );
}
