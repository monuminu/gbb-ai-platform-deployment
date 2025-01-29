import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const getTypographyStyles = (theme: Theme) => ({
  MuiTypography: {
    styleOverrides: {
      paragraph: {
        marginBottom: theme.spacing(2),
      },
      gutterBottom: {
        marginBottom: theme.spacing(1),
      },
    },
  },
});

export function typography(theme: Theme) {
  return getTypographyStyles(theme);
}
