import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const createShadow = (theme: Theme) => {
  const isLight = theme.palette.mode === 'light';
  const shadowColor = isLight ? theme.palette.grey[400] : theme.palette.common.black;
  return `0 0 3px 0 ${alpha(shadowColor, 0.32)}, 0 2px 6px -3px ${alpha(shadowColor, 0.14)}`;
};

const createMuiCardStyles = (theme: Theme) => ({
  root: {
    position: 'relative',
    boxShadow: createShadow(theme),
    borderRadius: theme.shape.borderRadius * 1.25,
    zIndex: 0,
  },
});

const createMuiCardHeaderStyles = (theme: Theme) => ({
  root: {
    padding: theme.spacing(3, 3, 0),
  },
});

const createMuiCardContentStyles = (theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
});

export function card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: createMuiCardStyles(theme),
    },
    MuiCardHeader: {
      styleOverrides: createMuiCardHeaderStyles(theme),
    },
    MuiCardContent: {
      styleOverrides: createMuiCardContentStyles(theme),
    },
  };
}
