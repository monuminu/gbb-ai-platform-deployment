import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/custom/css';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function ADLayout({ children, image, title }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        my: 'auto',
        maxWidth: 560,
        px: { xs: 4, md: 8 },
        pt: { xs: 15, md: 0 },
        pb: { xs: 15, md: 0 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '50%',
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/auth_layer.svg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || ''}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/drawing/auth_cover.png'}
        sx={{
          mt: -8,
          maxWidth: {
            xs: 480,
            lg: 560,
            xl: 620,
          },
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
