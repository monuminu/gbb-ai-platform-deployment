import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { NavigationLink } from 'src/routes/components';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  singleMode?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, singleMode = false, sx }) => {
    const settings = useSettingsContext();

    const isNavMini = settings.themeLayout === 'mini';

    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={isNavMini || singleMode ? '/logo/gbb_single.svg' : '/logo/gbb_full.svg'}
        sx={{ width: 146, height: 40, cursor: 'pointer', ...sx }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NavigationLink} path="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
