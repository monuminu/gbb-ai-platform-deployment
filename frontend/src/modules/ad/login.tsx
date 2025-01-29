import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { loginWithPopup } = useAuthContext();

  const handleLoginWithPopup = useCallback(async () => {
    try {
      await loginWithPopup?.();
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  // const handleLoginWithRedirect = useCallback(async () => {
  //   try {
  //     await loginWithRedirect?.({
  //       appState: {
  //         returnTo: returnTo || DEFAULT_PATH,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [loginWithRedirect, returnTo]);

  return (
    <>
      <Helmet>
        <title> AD: Login</title>
      </Helmet>

      <Stack spacing={1} sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4">Sign in to GBB / AI</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Azure OpenAI Workbench</Typography>
      </Stack>

      <Stack spacing={2}>
        <Button
          fullWidth
          color="inherit"
          size="large"
          variant="contained"
          startIcon={<Iconify icon="logos:microsoft-icon" width={22} height={22} sx={{ mr: 1 }} />}
          onClick={handleLoginWithPopup}
        >
          Sign in
        </Button>
      </Stack>
    </>
  );
}
