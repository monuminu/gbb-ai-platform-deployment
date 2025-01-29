import { useState } from 'react';
import { Icon } from '@iconify/react';
import bulbIcon from '@iconify/icons-tabler/bulb';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { UploadIconButton, MultiFilePreview } from 'src/components/upload';

// ----------------------------------------------------------------------

type Props = {
  onSend: Function;
};

export default function ChatBenchInput({ onSend }: Props) {
  const theme = useTheme();

  const [files] = useState<any[]>([]);

  const [message, setMessage] = useState('');

  // const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message) {
      return;
    }
    onSend({
      content: message,
      senderId: 'user',
      mode: 'new',
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: 'assistant',
      mode: 'new',
    });

    setMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        bottom: 0,
        width: '100%',
        minHeight: 52,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        borderTop: `solid 1px ${theme.palette.divider}`,
      }}
    >
      {/* <ChatMessageInputModeBtn chatMode={chatMode} onSetChatMode={onSetChatMode} /> */}

      <Stack sx={{ mr: 1 }}>
        <IconButton size="small" onClick={() => {}}>
          <Icon icon={bulbIcon} width={22} />
        </IconButton>
        {/* <ChatPromptPopover
          openPopover={openPopover}
          setMessage={setMessage}
          setOpenPopover={setOpenPopover}
        /> */}
      </Stack>

      <Stack sx={{ width: '100%' }} alignItems="center">
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ display: files.length === 0 ? 'none' : 'flex', width: '100%', mt: 0.75, ml: -1 }}
        >
          <MultiFilePreview
            thumbnail
            files={[]}
            onRemove={() => {}}
            sx={{ width: 64, height: 64 }}
            onClick={() => {}}
          />

          {/* <UploadBox onDrop={handleDrop} /> */}
        </Stack>
        <Input
          multiline
          maxRows={5}
          fullWidth
          value={message}
          disableUnderline
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          endAdornment={
            <Stack direction="row" sx={{ mr: 0.5, '& > *': { mx: 0.25 } }} alignItems="center">
              <UploadIconButton disabled={false} onDrop={() => {}} />
              <IconButton disabled={false} size="small" onClick={() => {}}>
                <Icon icon={attach2Fill} width={20} height={20} />
              </IconButton>
            </Stack>
          }
          sx={{ pb: 0.5 }}
        />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <IconButton
        disabled={message.trim().length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75 }}
      >
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>
    </Box>
  );
}
