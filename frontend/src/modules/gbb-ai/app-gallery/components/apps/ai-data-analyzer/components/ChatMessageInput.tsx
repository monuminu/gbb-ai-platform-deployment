import { useState } from 'react';
import { Icon } from '@iconify/react';
import micFill from '@iconify/icons-ri/mic-fill';
import bulbIcon from '@iconify/icons-tabler/bulb';
import roundSend from '@iconify/icons-ic/round-send';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Input, Stack, Divider, IconButton } from '@mui/material';

import { sendBtnColorSets } from 'src/utils/color-presets';

import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Participant } from 'src/types/chat';

import ChatPromptPopover from './ChatPromptPopover';

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  disabled: boolean;
  participants: Participant[] | null;
  onSend: Function;
  chatMode: string;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatMessageInput({
  disabled,
  participants,
  onSend,
  chatMode,
  onSetChatMode,
}: ChatMessageInputProps) {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const images = files.map((file) => ({ src: file.preview }));

  const lightbox = useLightBox(images);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleChange();
  //   }, 50);
  //   return () => clearTimeout(timer);
  // }, [message]);

  const handleInputFocus = (flag: boolean) => {
    setInputFocus(flag);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      onSetChatMode('rag');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'u') {
      onSetChatMode('function-calling');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'e') {
      onSetChatMode('open-chat');
    }
  };

  const handleSend = () => {
    if (!message || participants === null) {
      return;
    }
    onSend({
      content: message,
      senderId: 'user',
      mode: 'new',
      attachments: files,
    });
    // onSend({
    //   content: '(SYS)Working on it...',
    //   senderId: participantIds[0],
    //   mode: 'new',
    // });

    setMessage('');
    setFiles([]);
  };

  return (
    <Box
      sx={{
        ml: 0.5,
        mr: -0.5,
        minHeight: 52,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        bottom: -66,
        width: 'calc(100% - 8px)',
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        py: 0.5,
        borderRadius: 0.75,
        // border: inputFocus
        //   ? `solid 1.5px ${sendBtnColorSets[chatMode]}`
        //   : "None",
        ...{
          boxShadow: inputFocus
            ? `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.12
              )}, 0 1px 10px 2px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.1
              )}`
            : `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.12
              )}, 0 1px 4px -1px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.14
              )}`,
        },
      }}
    >
      {/* <ChatMessageInputModeBtn chatMode={chatMode} onSetChatMode={onSetChatMode} /> */}

      <Stack sx={{ mr: 1 }}>
        <IconButton size="small" onClick={handleOpenPopover}>
          <Icon icon={bulbIcon} width={22} />
        </IconButton>
        <ChatPromptPopover
          openPopover={openPopover}
          setMessage={setMessage}
          setOpenPopover={setOpenPopover}
        />
      </Stack>

      <Input
        className="llm-input"
        multiline
        maxRows={10}
        fullWidth
        value={message}
        disableUnderline
        onBlur={() => handleInputFocus(false)}
        onFocus={() => handleInputFocus(true)}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter question"
        endAdornment={
          <Stack direction="row" sx={{ mr: 0.5, '& > *': { mx: 0.25 } }} alignItems="center">
            <IconButton disabled={disabled} size="small">
              <Icon icon={micFill} width={20} height={20} />
            </IconButton>
          </Stack>
        }
        sx={{ pb: 0.5 }}
      />
      <Divider orientation="vertical" flexItem />

      <IconButton
        disabled={message.trim().length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75 }}
      >
        <Icon color={sendBtnColorSets[chatMode]} icon={roundSend} width={24} height={24} />
      </IconButton>

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </Box>
  );
}
