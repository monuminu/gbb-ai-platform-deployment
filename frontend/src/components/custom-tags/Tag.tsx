import { BoxProps } from '@mui/material';
import { alpha, Theme, styled, useTheme } from '@mui/material/styles';

import { ColorSchema } from 'src/custom/palette';

// ----------------------------------------------------------------------

type LabelColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

type LabelVariant = 'filled' | 'outlined' | 'ghost';

const RootStyle = styled('span')(({
  theme,
  ownerState,
}: {
  theme: Theme;
  ownerState: {
    color: LabelColor;
    variant: LabelVariant;
  };
}) => {
  const isLight = theme.palette.mode === 'light';
  const { color, variant } = ownerState;

  const styleFilled = (cs: ColorSchema) => ({
    color: theme.palette[cs].contrastText,
    backgroundColor: theme.palette[cs].main,
  });

  const styleOutlined = (cs: ColorSchema) => ({
    color: theme.palette[cs].main,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette[cs].main}`,
  });

  const styleGhost = (cs: ColorSchema) => ({
    color: theme.palette[cs][isLight ? 'dark' : 'light'],
    backgroundColor: alpha(theme.palette[cs].main, 0.22),
  });

  return {
    height: 20,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 4,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,

    ...(color !== 'default'
      ? {
          ...(variant === 'filled' && { ...styleFilled(color) }),
          ...(variant === 'outlined' && { ...styleOutlined(color) }),
          ...(variant === 'ghost' && { ...styleGhost(color) }),
        }
      : {
          ...(variant === 'outlined' && {
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
          }),
          ...(variant === 'ghost' && {
            color: isLight ? theme.palette.text.secondary : theme.palette.common.white,
            backgroundColor: alpha(theme.palette.grey[500], 0.16),
          }),
        }),
  };
});

// ----------------------------------------------------------------------

interface LabelProps extends BoxProps {
  color?: LabelColor;
  variant?: LabelVariant;
}

export default function Tag({ color = 'default', variant = 'ghost', children, sx }: LabelProps) {
  const theme = useTheme();

  return (
    <RootStyle ownerState={{ color, variant }} sx={sx} theme={theme}>
      {children}
    </RootStyle>
  );
}
