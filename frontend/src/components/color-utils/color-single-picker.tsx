import checkmarkFill from '@iconify/icons-eva/checkmark-fill';

import { alpha } from '@mui/material/styles';
import { Box, Radio, BoxProps, RadioGroup, RadioGroupProps } from '@mui/material';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  colors: string[];
}

export default function ColorSinglePicker({ colors, ...other }: Props) {
  return (
    <RadioGroup row {...other}>
      {colors.map((color) => {
        const isWhite = color === '#FFFFFF' || color === 'white';

        return (
          <Radio
            key={color}
            value={color}
            color="default"
            icon={
              <IconColor
                sx={{
                  ...(isWhite && {
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }),
                }}
              />
            }
            checkedIcon={
              <IconColor
                sx={{
                  transform: 'scale(1.4)',
                  '&:before': {
                    opacity: 0.48,
                    width: '100%',
                    content: "''",
                    height: '100%',
                    borderRadius: '50%',
                    position: 'absolute',
                    boxShadow: '2px 2px 4px 0 currentColor',
                  },
                  '& svg': { width: 12, height: 12, color: 'common.white' },
                  ...(isWhite && {
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    boxShadow: (theme) => `4px 4px 8px 0 ${alpha(theme.palette.grey[500], 0.24)}`,
                    '& svg': { width: 12, height: 12, color: 'common.black' },
                  }),
                }}
              />
            }
            sx={{
              color,
              '&:hover': { opacity: 0.72 },
            }}
          />
        );
      })}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------

function IconColor({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        display: 'flex',
        borderRadius: '50%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'currentColor',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        ...sx,
      }}
      {...other}
    >
      <Iconify icon={checkmarkFill} />
    </Box>
  );
}
