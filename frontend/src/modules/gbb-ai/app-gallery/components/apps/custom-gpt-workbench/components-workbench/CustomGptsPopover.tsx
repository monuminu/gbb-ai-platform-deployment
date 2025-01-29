import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Avatar,
  MenuItem,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';

import { ICustomGpt } from 'src/types/app';

// ----------------------------------------------------------------------

// const _gpts = [
//   {
//     id: '1',
//     name: 'Image Guru',
//     coverUrl: '/assets/avatars/avatar_1.jpg',
//     description:
//       'A GPT specialized in generating and refining images with a mix of professional and friendly tone.',
//   },
//   {
//     id: '2',
//     name: 'Image Guru',
//     coverUrl: '/assets/avatars/avatar_2.jpg',
//     description:
//       'A GPT specialized in generating and refining images with a mix of professional and friendly tone.',
//   },
//   {
//     id: '3',
//     name: 'Image Guru',
//     coverUrl: '/assets/avatars/avatar_3.jpg',
//     description:
//       'A GPT specialized in generating and refining images with a mix of professional and friendly tone.',
//   },
//   {
//     id: '4',
//     name: '文案大师',
//     coverUrl: '/assets/avatars/avatar_4.jpg',
//     description:
//       'A GPT specialized in generating and refining images with a mix of professional and friendly tone.',
//   },
// ];

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
  '&.Mui-focused': { boxShadow: theme.customShadows.z3 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.16)} !important`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  searchText: string;
  customGpts: ICustomGpt[];
  anchorWidth: number;
  openPopover: HTMLElement | null;
  onClosePopover: () => void;
  onSetCurrentGpt: (gpt: ICustomGpt | null) => void;
};

export default function CustomGptsPopover({
  searchText,
  customGpts,
  anchorWidth,
  openPopover,
  onClosePopover,
  onSetCurrentGpt,
}: Props) {
  const theme = useTheme();
  const [filterName, setFilterName] = useState(searchText);

  // const [focusedItem, setFocusedItem] = useState(0);

  // const handleKeyDown = (event: any, index: number) => {
  //   if (event.key === 'ArrowDown') {
  //     event.preventDefault();
  //     setFocusedItem((prevIndex) => (prevIndex + 1) % filteredGpts.length);
  //   } else if (event.key === 'ArrowUp') {
  //     event.preventDefault();
  //     setFocusedItem((prevIndex) => (prevIndex - 1 + filteredGpts.length) % filteredGpts.length);
  //   }
  // };

  useEffect(() => {
    setFilterName(searchText || '');
    // eslint-disable-next-line
  }, [searchText]);

  const hanldeSetCurrentGpt = (gpt: ICustomGpt) => {
    onSetCurrentGpt(gpt);
  };

  const filteredGpts = filterName
    ? customGpts.filter((gpt) => gpt.name.toLowerCase().includes(filterName.toLowerCase()))
    : customGpts;

  return (
    <CustomPopover
      open={openPopover}
      onClose={onClosePopover}
      arrow="bottom-left"
      style={{ transform: 'translateY(-10px)' }}
      sx={{
        ml: -0.8,
        width: anchorWidth,
        boxShadow: theme.customShadows.z8,
      }}
      hiddenArrow
      disableAutoFocus
      disableEnforceFocus
    >
      <Stack spacing={1} direction="row" alignItems="center" sx={{ mx: 1, my: 1 }}>
        <SearchStyle
          value={filterName}
          sx={{ width: 1 }}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Search custom GPT..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          endAdornment={
            <IconButton size="small">
              <Icon icon={refreshFill} width={16} />
            </IconButton>
          }
        />
      </Stack>
      <Scrollbar sx={{ height: 248, width: '100%', overflowX: 'hidden' }}>
        {filteredGpts.map((gpt) => (
          <MenuItem
            key={gpt.id}
            onClick={() => {
              onClosePopover();
              hanldeSetCurrentGpt(gpt);
            }}
            sx={{ mx: 1, px: 1, mb: 1, typography: 'body2' }}
            // onKeyDown={(event) => handleKeyDown(event, index)}
            // autoFocus={index === focusedItem}
          >
            <Stack spacing={1.5} direction="row" alignItems="center" sx={{ maxWidth: '100%' }}>
              <Avatar alt="copilot" src={gpt.coverUrl} sx={{ width: 34, height: 34, mx: 'auto' }} />
              <Typography variant="subtitle1">{gpt.name}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {gpt.description}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Scrollbar>
    </CustomPopover>
  );
}
