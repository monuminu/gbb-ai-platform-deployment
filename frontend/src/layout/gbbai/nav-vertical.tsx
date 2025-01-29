import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import menuBookOutlineRounded from '@iconify/icons-material-symbols/menu-book-outline-rounded';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../header/nav-toggle-button';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { t } = useTranslate();

  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 2, ml: 2.1, mb: 0.5 }} />

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavUpgrade /> */}

      <Box sx={{ m: 2, pb: 2, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to={paths.documentation.introduction}
          target="_blank"
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon={menuBookOutlineRounded} />}
          sx={{ px: 3, color: 'text.secondary', mx: 'auto' }}
        >
          {t('documentation')}
        </Button>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
