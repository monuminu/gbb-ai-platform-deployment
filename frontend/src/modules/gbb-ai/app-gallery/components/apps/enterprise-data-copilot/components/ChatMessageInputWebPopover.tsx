import { useState, useEffect } from 'react';

import { alpha, styled, useTheme } from '@mui/material/styles';
import { IconButton, OutlinedInput, InputAdornment } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  height: 42,
  fontSize: 14,
  paddingLeft: 10,
  paddingRight: 6,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  // '&.Mui-focused': { boxShadow: theme.customShadows.z3 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.16)} !important`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  url: string;
  moveUpper: boolean;
  anchorWidth: number;
  openPopover: HTMLElement | null;
  onClosePopover: () => void;
  onAddWebsite: (website: string) => void;
};

export default function ChatMessageInputWebPopover({
  url,
  moveUpper,
  anchorWidth,
  openPopover,
  onClosePopover,
  onAddWebsite,
}: Props) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');
  const [website, setWebsite] = useState(url);

  useEffect(() => {
    setWebsite(url || '');
    // eslint-disable-next-line
  }, [url]);

  const handleAddWebsite = () => {
    if (website === '' || !website.startsWith('http')) return;
    onAddWebsite(website);
    setWebsite('');
    onClosePopover();
  };

  return (
    <CustomPopover
      open={openPopover}
      onClose={onClosePopover}
      arrow="bottom-right"
      style={{ transform: moveUpper ? 'translateY(-56px)' : 'translateY(-16px)' }}
      sx={{
        ml: lgUp ? 8.1 : 0.9,
        p: 1.25,
        width: anchorWidth,
        maxWidth: anchorWidth,
        boxShadow: theme.customShadows.z4,
      }}
      hiddenArrow
      disableAutoFocus
      disableEnforceFocus
    >
      <SearchStyle
        value={website}
        // autoFocus
        sx={{ width: 1 }}
        onChange={(e) => setWebsite(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddWebsite();
        }}
        placeholder="https://"
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={18} icon="mdi:web" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        endAdornment={
          <IconButton size="small" onClick={handleAddWebsite}>
            <Iconify width={18} icon="mingcute:check-fill" sx={{ color: 'text.disabled' }} />
          </IconButton>
        }
      />
    </CustomPopover>
  );
}
