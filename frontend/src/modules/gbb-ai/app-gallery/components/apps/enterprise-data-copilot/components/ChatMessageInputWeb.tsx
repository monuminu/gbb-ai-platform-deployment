import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

type Props = {
  id: number;
  website: string;
  color?: string;
  iconPl?: number;
  maxWidth?: number;
  iconColor?: string;
  borderOpacity?: number;
  onRemoveWebsite?: (id: number) => void;
};

export default function ChatMessageInputWeb({
  id,
  website,
  iconPl = 0.5,
  color = 'text.primary',
  iconColor = 'primary.main',
  maxWidth = 200,
  borderOpacity = 0.18,
  onRemoveWebsite,
}: Props) {
  const theme = useTheme();
  const [showButton, setShowButton] = useState(false);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      sx={{
        position: 'relative',
        p: 0.25,
        px: 0.5,
        pl: iconPl,
        width: maxWidth,
        border: `${alpha(theme.palette.divider, borderOpacity)} 1px solid`,
        borderRadius: 0.75,
      }}
    >
      <SvgColor
        src="/assets/icons/files/ic_web.svg"
        sx={{ width: 28, height: 28, mr: -0.25, my: 'auto', color: iconColor }}
      />
      <Box
        sx={{
          pl: -1,
          width: '100%',
          fontSize: '12px',
          // maxWidth,
          color,
          overflow: 'auto',
          textTransform: 'none',
          // textOverflow: 'ellipsis',
          whiteSpace: 'noWrap',
          justifyContent: 'flex-start',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Typography sx={{ fontSize: '13px' }}>{website}</Typography>
      </Box>

      {showButton && onRemoveWebsite && (
        <IconButton
          onClick={() => onRemoveWebsite(id)}
          sx={{
            p: 0,
            top: 2,
            right: 2,
            zIndex: 9,
            opacity: 0.6,
            width: '16px',
            height: '16px',
            bgcolor: 'text.secondary',
            position: 'absolute',
            justifyContent: 'center',
            '&:hover': { bgcolor: 'text.secondary', opacity: 0.8 },
          }}
        >
          <Iconify icon="maki:cross" width={10} color="background.default" />
        </IconButton>
      )}
    </Stack>
  );
}
