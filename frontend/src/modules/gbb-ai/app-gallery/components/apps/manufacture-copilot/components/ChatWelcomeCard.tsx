import { Icon } from '@iconify/react';
import chatIcon from '@iconify/icons-material-symbols/chat';
import functionIcon from '@iconify/icons-material-symbols/function';
import twotoneContentPasteSearch from '@iconify/icons-ic/twotone-content-paste-search';

import { styled, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Typography } from '@mui/material';

import { sendBtnColorSets } from 'src/utils/color-presets';

import { textGradient } from 'src/custom/css';

// ----------------------------------------------------------------------

type GradientProps = {
  gradientColors: string[];
};

const options = {
  shouldForwardProp: (prop: string) => prop !== 'gradientColors',
};

const RoundGradientCard = styled(
  Card,
  options
)<GradientProps>(({ theme }) => ({
  position: 'relative',
  border: '3px solid transparent',
  backgroundClip: 'padding-box',
  '&:after': {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    background: `linear-gradient(to left, 
      ${theme.palette.background.paper}, 
      ${theme.palette.background.paper})`,
    content: '""',
    zIndex: -1,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  gradient: string;
  chatMode: string;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatWelcomeCard({
  title,
  content,
  gradient,
  chatMode,
  onSetChatMode,
}: Props) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const handleClick = () => {
    onSetChatMode(title.toLowerCase().split(' ').join('-'));
  };

  let icon;
  if (title.toLowerCase().startsWith('open')) {
    icon = chatIcon;
  } else if (title.toLowerCase().startsWith('rag')) {
    icon = twotoneContentPasteSearch;
  } else {
    icon = functionIcon;
  }
  return (
    <RoundGradientCard
      gradientColors={['red', 'yellow']}
      onClick={handleClick}
      sx={{
        px: 1.75,
        pt: 1,
        pb: 1.5,
        borderRadius: 1.25,
        background: isLight ? theme.palette.grey[300] : theme.palette.grey[700],
        border: `10px solid ${gradient}`,
        '&:hover': {
          opacity: 0.9,
          transition: theme.transitions.create('opacity'),
        },
        ...(chatMode.includes(title.split(' ')[0].toLowerCase()) && {
          bgcolor: 'background.paper',
          background: gradient,
          boxShadow: (_theme) => _theme.customShadows.z20,
        }),
      }}
    >
      <Stack direction="row" spacing={1.75} alignItems="center">
        <Box sx={{ mx: 1, mt: 1 }} color={textGradient(sendBtnColorSets[chatMode])}>
          <Icon
            icon={icon}
            width={26}
            height={26}
            color={
              chatMode.includes(title.split(' ')[0].toLowerCase()) && sendBtnColorSets[chatMode]
            }
          />
        </Box>
        <Stack spacing={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="subtitle2" sx={{ px: 0, lineHeight: 1.5 }}>
            {content}
          </Typography>
        </Stack>
      </Stack>
    </RoundGradientCard>
  );
}
