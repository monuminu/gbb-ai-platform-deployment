import { useState } from 'react';
import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';

import { styled } from '@mui/material/styles';
import { Box, Stack, Paper, Button, Collapse, Typography, IconButton } from '@mui/material';

// ----------------------------------------------------------------------

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  height: 2,
  borderRadius: 0,
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(0),
}));

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  title: string;
  prompt: string;
  onSelectQuery: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatPromptItem({ selected, title, prompt, onSelectQuery }: Props) {
  const [openQuery, setOpenQuery] = useState(false);

  return (
    <Paper sx={{ p: 1, m: 1, mb: 1.5, mt: 1.5, bgcolor: 'background.neutral' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <IconButton size="small" onClick={() => setOpenQuery((prev) => !prev)}>
          <Icon icon={openQuery ? arrowIosDownwardFill : arrowIosForwardFill} width={20} />
        </IconButton>
        <CollapseButtonStyle
          // disableRipple
          onClick={() => onSelectQuery(prompt)}
          // startIcon={
          //   <Icon
          //     icon={openQuery ? arrowIosDownwardFill : arrowIosForwardFill}
          //     width={16}
          //     height={16}
          //   />
          // }
          sx={{
            '&:hover': { backgroundColor: 'transparent' },
            color: 'text.primary',
          }}
        >
          <Typography variant="body2" fontWeight={600} textOverflow="ellipsis" noWrap>
            {title}
          </Typography>
        </CollapseButtonStyle>
        {/* <Radio
          size="small"
          checked={selected}
          onClick={() => onSelectQuery(prompt)}
        /> */}
      </Box>

      <Box sx={{ mb: openQuery ? 0.5 : 0 }}>
        <Collapse in={openQuery}>
          <Stack spacing={1} sx={{ my: 1 }}>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                px: 1,
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 5,
              }}
            >
              {prompt}
            </Typography>
          </Stack>
        </Collapse>
      </Box>
    </Paper>
  );
}
