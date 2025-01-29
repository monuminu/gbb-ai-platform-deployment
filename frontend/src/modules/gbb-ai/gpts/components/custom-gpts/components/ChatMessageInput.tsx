import { Icon } from '@iconify/react';
import micFill from '@iconify/icons-ri/mic-fill';
import bulbIcon from '@iconify/icons-tabler/bulb';
import roundSend from '@iconify/icons-ic/round-send';
import { useState, useEffect, useCallback } from 'react';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Input, Stack, Divider, IconButton } from '@mui/material';

import Lightbox, { useLightBox } from 'src/components/lightbox';
import { CustomFile, UploadIconButton, MultiFilePreview } from 'src/components/upload';

import { Participant } from 'src/types/chat';

import ChatPromptPopover from './ChatPromptPopover';

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  onSend: Function;
  chatMode: string;
  disabled: boolean;
  samplePrompts: string[];
  participants: Participant[] | null;
};

export default function ChatMessageInput({
  onSend,
  chatMode,
  disabled,
  participants,
  samplePrompts,
}: ChatMessageInputProps) {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [lines, setLines] = useState(0);
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const images = files.map((file) => ({ src: file.preview || '' }));

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 50);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = () => {
    const inputPanel = document.querySelector('.llm-input');
    if (inputPanel) {
      let lineCount;
      if (inputPanel.clientHeight < 60) {
        lineCount = 1;
      } else if (inputPanel.clientHeight >= 60 && inputPanel.clientHeight < 80) {
        lineCount = 2;
      } else if (inputPanel.clientHeight >= 80 && inputPanel.clientHeight < 100) {
        lineCount = 3;
      } else {
        lineCount = 4;
      }
      setLines(lineCount);
    }
  };

  const handleInputFocus = (flag: boolean) => {
    setInputFocus(flag);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    }
  };

  const participantIds =
    participants === null ? [] : participants.map((participant) => participant.id);

  const handleSend = () => {
    if ((!message && files.length === 0) || participants === null) {
      return;
    }
    onSend({
      content: message,
      senderId: 'user',
      mode: 'new',
      attachments: files,
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: participantIds[0],
      mode: 'new',
    });

    setMessage('');
    setFiles([]);
    setLines(1);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  // console.log(files);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = files.filter((file) => file !== inputFile);
      setFiles(filtered);
    },
    [files]
  );

  let borderRadius;
  if (files.length > 0) {
    borderRadius = 1;
  } else if (lines < 2) {
    borderRadius = 20;
  } else if (lines === 2) {
    borderRadius = 2.5;
  } else if (lines === 3) {
    borderRadius = 2;
  } else {
    borderRadius = 1.5;
  }

  return (
    <Box
      sx={{
        minHeight: 52,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        bottom: -64,
        width: '100%',
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        py: 0.5,
        // border: inputFocus
        //   ? `solid 1.5px ${sendBtnColorSets[chatMode]}`
        //   : "None",
        ...{
          boxShadow: inputFocus
            ? `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.32
              )}, 0 1px 10px 2px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.1
              )}`
            : `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.32
              )}, 0 1px 4px -1px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.34
              )}`,
          borderRadius,
        },
      }}
    >
      <Stack sx={{ mr: 1 }}>
        <IconButton size="small" onClick={handleOpenPopover}>
          <Icon icon={bulbIcon} width={22} />
        </IconButton>
        <ChatPromptPopover
          setMessage={setMessage}
          openPopover={openPopover}
          samplePrompts={samplePrompts}
          setOpenPopover={setOpenPopover}
        />
      </Stack>

      <Stack sx={{ width: '100%' }} alignItems="center">
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ display: files.length === 0 ? 'none' : 'flex', width: '100%', mt: 0.75, ml: -1 }}
        >
          <MultiFilePreview
            thumbnail
            files={files}
            onRemove={(file) => handleRemoveFile(file)}
            sx={{ width: 64, height: 64 }}
            onClick={handleOpenLightbox}
          />

          {/* <UploadBox onDrop={handleDrop} /> */}
        </Stack>
        <Input
          className="llm-input"
          multiline
          maxRows={10}
          // disabled={disabled}
          fullWidth
          value={message}
          disableUnderline
          onBlur={() => handleInputFocus(false)}
          onFocus={() => handleInputFocus(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a prompt"
          endAdornment={
            <Stack direction="row" sx={{ mr: 0.5, '& > *': { mx: 0.25 } }} alignItems="center">
              <UploadIconButton disabled={chatMode !== 'open-chat'} onDrop={handleDrop} />
              <IconButton disabled={disabled} size="small" onClick={() => {}}>
                <Icon icon={attach2Fill} width={20} height={20} />
              </IconButton>
              <IconButton disabled={disabled} size="small">
                <Icon icon={micFill} width={20} height={20} />
              </IconButton>
            </Stack>
          }
          sx={{ pb: 0.5 }}
        />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <IconButton
        disabled={message.trim().length === 0 && files.length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75 }}
        color="primary"
      >
        <Icon icon={roundSend} width={24} height={24} />
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
