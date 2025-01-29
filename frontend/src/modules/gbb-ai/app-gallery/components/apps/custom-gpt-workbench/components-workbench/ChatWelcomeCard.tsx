import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Typography } from '@mui/material';

import { ICustomGpt } from 'src/types/app';

// ----------------------------------------------------------------------

type Props = {
  customGpt: ICustomGpt;
  onSetCurrentGpt: (gpt: ICustomGpt | null) => void;
};

export default function ChatWelcomeCard({ customGpt, onSetCurrentGpt }: Props) {
  const theme = useTheme();

  const { name, description, coverUrl } = customGpt;

  const handleClick = () => {
    onSetCurrentGpt(customGpt);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        px: 1.25,
        py: 1.5,
        borderRadius: 1.25,
        background: 'background.paper',
        '&:hover': {
          opacity: 0.9,
          transition: theme.transitions.create('opacity'),
          boxShadow: (_theme) => _theme.customShadows.z20,
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ height: '100%' }}>
        <Box sx={{ mx: 1 }}>
          <Avatar alt="copilot" src={coverUrl} sx={{ width: 48, height: 48, mx: 'auto' }} />
        </Box>
        <Stack spacing={1} sx={{ height: '100%' }}>
          <Typography variant="h6">{name || ''}</Typography>
          <Typography
            variant="body2"
            sx={{
              pr: 0.75,
              display: '-webkit-box',
              overflow: 'hidden',
              fontSize: '13px',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {description || ''}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
