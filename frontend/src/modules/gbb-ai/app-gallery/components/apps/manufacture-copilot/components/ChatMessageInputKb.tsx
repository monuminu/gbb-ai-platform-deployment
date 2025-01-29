import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  kb: string | undefined;
  onOpenKbPopover?: () => void;
};

export default function ChatMessageInputKb({ kb, onOpenKbPopover }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      // onClick={onOpenKbPopover}
      sx={{
        // cursor: 'pointer',
        position: 'relative',
        py: 0.5,
        px: 1.25,
        maxWidth: 200,
        border: `${alpha(theme.palette.divider, 0.18)} 1px solid`,
        borderRadius: 0.75,
      }}
    >
      <FileThumbnail file="folder" sx={{ width: 18, height: 18 }} />
      <Box
        sx={{
          width: '100%',
          fontSize: '12px',
          overflow: 'auto',
          textTransform: 'none',
          whiteSpace: 'noWrap',
          justifyContent: 'flex-start',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Typography sx={{ fontSize: '13px' }}>{kb || 'No knowledge base'}</Typography>
      </Box>
    </Stack>
  );
}
