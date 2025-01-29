import { useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import starsOutline from '@iconify/icons-mdi/stars-outline';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  currentGpt: { name: string; coverUrl: string } | null;
  onClearGpt: () => void;
  handleOpenPopover: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function CustomGptsSelectionBtn({
  currentGpt,
  onClearGpt,
  handleOpenPopover,
}: Props) {
  const theme = useTheme();
  const [mouseEntered, setMouseEntered] = useState(false);

  const avatarSize = mouseEntered ? 32 : 40;
  const p = mouseEntered ? 0.5 : 0;

  return (
    <>
      {currentGpt && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            p,
            mr: 0.25,
            height: 40,
            borderRadius: 20,
            background: alpha(theme.palette.grey[500], 0.16),
          }}
          onMouseEnter={() => {
            setMouseEntered(true);
          }}
          onMouseLeave={() => {
            setMouseEntered(false);
          }}
          onClick={handleOpenPopover}
        >
          <Avatar
            alt={currentGpt.name}
            src={currentGpt.coverUrl}
            sx={{ width: avatarSize, height: avatarSize }}
          />
          {mouseEntered && (
            <>
              <Typography variant="body2" noWrap>
                {currentGpt.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onClearGpt();
                  setMouseEntered(false);
                }}
              >
                <Iconify icon={closeFill} />
              </IconButton>
            </>
          )}
        </Stack>
      )}
      {!currentGpt && (
        <Button
          variant="soft"
          color="inherit"
          onClick={handleOpenPopover}
          startIcon={<Icon icon={starsOutline} />}
          sx={{
            width: 40,
            maxWidth: 40,
            minWidth: 40,
            height: 40,
            padding: 1,
            paddingRight: 1,
            borderRadius: 20,
            whiteSpace: 'nowrap',
            mr: 1,
            '& .MuiButton-startIcon': { mx: 0 },
          }}
        />
      )}
    </>
  );
}
