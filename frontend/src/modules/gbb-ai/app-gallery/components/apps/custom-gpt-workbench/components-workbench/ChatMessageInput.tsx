import { Icon } from '@iconify/react';
import micFill from '@iconify/icons-ri/mic-fill';
import bulbIcon from '@iconify/icons-tabler/bulb';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import { useRef, useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Input, Stack, Divider, IconButton } from '@mui/material';

import Lightbox, { useLightBox } from 'src/components/lightbox';
import { UploadIconButton, MultiFilePreview } from 'src/components/upload';

import { ICustomGpt } from 'src/types/app';
import { Participant } from 'src/types/chat';

import ChatPromptPopover from './ChatPromptPopover';
import CustomGptsPopover from './CustomGptsPopover';
import CustomGptsSelectionBtn from './CustomGptsSelectionBtn';

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  disabled: boolean;
  customGpts: ICustomGpt[];
  participants: Participant[] | null;
  onSend: Function;
  chatMode: string;
  currentGpt: ICustomGpt | null;
  onSetCurrentGpt: (gpt: ICustomGpt | null) => void;
};

export default function ChatMessageInput({
  disabled,
  customGpts,
  participants,
  onSend,
  chatMode,
  currentGpt,
  onSetCurrentGpt,
}: ChatMessageInputProps) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const buttonRef = useRef(null);
  const [lines, setLines] = useState(0);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const [inputFocus, setInputFocus] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openGptsPopover, setOpenGptsPopover] = useState<HTMLElement | null>(null);

  const handleSetCurrentGpt = (gpt: ICustomGpt | null) => {
    onSetCurrentGpt(gpt);
    if (message.startsWith('@')) {
      setMessage('');
    }
  };

  const handleClearGpt = () => {
    onSetCurrentGpt(null);
  };

  const images = files.map((file) => ({ src: file.preview }));

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleGptsButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenGptsPopover(event.currentTarget);
  };

  const handleOpenGptsPopover = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.startsWith('@')) {
      setOpenGptsPopover(buttonRef.current);
    } else setOpenGptsPopover(null);
  };

  const handleCloseGptsPopover = () => {
    setOpenGptsPopover(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 50);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (openGptsPopover && anchorRef.current) {
      setAnchorWidth((anchorRef.current as HTMLElement).offsetWidth);
    }
  }, [openGptsPopover]);

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
    if (!message || participants === null) {
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
      ref={anchorRef}
      sx={{
        minHeight: 52,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        bottom: -64,
        width: '100%',
        paddingLeft: theme.spacing(0.75),
        backgroundColor: theme.palette.background.paper,
        py: 0.5,
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
      <div ref={buttonRef}>
        <CustomGptsSelectionBtn
          currentGpt={currentGpt}
          onClearGpt={handleClearGpt}
          handleOpenPopover={handleGptsButtonClick}
        />
      </div>

      <Stack sx={{ mx: 0.5 }}>
        <IconButton size="small" onClick={handleOpenPopover}>
          <Icon icon={bulbIcon} width={22} />
        </IconButton>
        <ChatPromptPopover
          openPopover={openPopover}
          samplePrompts={currentGpt ? currentGpt.samplePrompts : []}
          setMessage={setMessage}
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
          onChange={(e) => {
            setMessage(e.target.value);
            handleOpenGptsPopover(e);
          }}
          placeholder="Enter a message"
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
        disabled={message.trim().length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75, color: '#3f8bcf' }}
      >
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />

      <CustomGptsPopover
        searchText={message.startsWith('@') ? message.slice(1) : ''}
        customGpts={customGpts}
        anchorWidth={anchorWidth}
        openPopover={openGptsPopover}
        onClosePopover={handleCloseGptsPopover}
        onSetCurrentGpt={handleSetCurrentGpt}
      />
    </Box>
  );
}
