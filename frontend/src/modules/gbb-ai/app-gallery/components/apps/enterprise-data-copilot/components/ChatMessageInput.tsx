import { Icon } from '@iconify/react';
// import micFill from '@iconify/icons-ri/mic-fill';
import bulbIcon from '@iconify/icons-tabler/bulb';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import { useRef, useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Input, Stack, Button, Divider, IconButton } from '@mui/material';

import { sendBtnColorSets } from 'src/utils/color-presets';

import { useFetchKmmList } from 'src/api/kmm';

import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { UploadIconButton, MultiFilePreview } from 'src/components/upload';

import { Participant } from 'src/types/chat';

import ChatPromptPopover from './ChatPromptPopover';
import ChatMessageInputKb from './ChatMessageInputKb';
import ChatMessageInputWeb from './ChatMessageInputWeb';
import ChatMessageInputTool from './ChatMessageInputTool';
import ChatMessageInputModeBtn from './ChatMessageInputModeBtn';
import ChatMessageInputKbPopover from './ChatMessageInputKbPopover';
import ChatMessageInputWebPopover from './ChatMessageInputWebPopover';
import ChatMessageInputToolPopover from './ChatMessageInputToolPopover';

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  chatMode: string;
  onSend: Function;
  disabled: boolean;
  status: 'idle' | 'running';
  selectedTools: string[];
  selectedKbIndex: string;
  participants: Participant[] | null;
  onSelectIndex: (index: string) => void;
  onSelectTools: (tools: string[]) => void;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatMessageInput({
  status,
  onSend,
  chatMode,
  disabled,
  participants,
  onSetChatMode,
  onSelectIndex,
  onSelectTools,
  selectedTools,
  selectedKbIndex,
}: ChatMessageInputProps) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const buttonRef = useRef(null);

  const [lines, setLines] = useState(0);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const [inputFocus] = useState(false);
  const [websites, setWebsites] = useState<string[]>([]);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openKbPopover, setOpenKbPopover] = useState<HTMLElement | null>(null);
  const [openWebPopover, setOpenWebPopover] = useState<HTMLElement | null>(null);
  const [openToolPopover, setOpenToolPopover] = useState<HTMLElement | null>(null);

  const { kmmList } = useFetchKmmList(0);

  const selectedKbName = kmmList.find((_kb) => _kb.index === selectedKbIndex)?.name;

  const images = files.map((file) => ({ src: file.preview }));

  const lightbox = useLightBox(images);

  const participantIds =
    participants === null ? [] : participants.map((participant) => participant.id);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseWebPopover = () => {
    setOpenWebPopover(null);
  };

  const handleClickOpenWebPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenWebPopover(event.currentTarget);
  };

  const handleCloseKbPopover = () => {
    setOpenKbPopover(null);
  };

  const handleClickOpenKbPopover = () => {
    setOpenKbPopover(anchorRef.current);
  };

  const handleCloseToolPopover = () => {
    setOpenToolPopover(null);
  };

  const handleClickOpenToolPopover = () => {
    setOpenToolPopover(anchorRef.current);
  };

  const handleOpenKbOrWebPopover = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (chatMode === 'rag' && event.target.value.startsWith('#')) {
      setOpenKbPopover(anchorRef.current);
    } else if (chatMode === 'open-chat' && event.target.value.startsWith('#')) {
      setOpenWebPopover(buttonRef.current);
    } else if (chatMode === 'function-calling' && event.target.value.startsWith('#')) {
      setOpenToolPopover(anchorRef.current);
    } else {
      setOpenKbPopover(null);
      setOpenToolPopover(null);
    }
  };

  const handleSetAddWebsite = (website: string) => {
    setWebsites((prev) => [website, ...prev]);
  };

  const handleRemoveWebsite = useCallback(
    (index: number) => {
      setWebsites((prevWebsites) => prevWebsites.filter((_, i) => i !== index));
    },
    [setWebsites]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 50);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if ((openWebPopover || openKbPopover || openToolPopover) && anchorRef.current) {
      setAnchorWidth((anchorRef.current as HTMLElement).offsetWidth);
    }
  }, [openWebPopover, openKbPopover, openToolPopover]);

  useEffect(() => {
    const handleResize = () => {
      if (anchorRef.current) {
        setAnchorWidth((anchorRef.current as HTMLElement).offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // const handleInputFocus = (flag: boolean) => {
  //   setInputFocus(flag);
  // };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    } else if (event.key === 'Enter') {
      if (message.startsWith('#http') && chatMode === 'open-chat') {
        event.preventDefault();
        handleAddWebsiteByEnter();
      }
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      onSetChatMode('rag');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'u') {
      onSetChatMode('function-calling');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'e') {
      onSetChatMode('open-chat');
    }
  };

  const handleAddWebsiteByEnter = () => {
    if (!message.startsWith('#http')) return;
    handleSetAddWebsite(message.slice(1));
    setMessage('');
    handleCloseWebPopover();
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
      sources: websites.map((website) => ({ label: website, url: website })),
      status: 'running',
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: participantIds[0],
      mode: 'new',
      status: 'running',
    });

    setMessage('');
    setFiles([]);
    setWebsites([]);
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
  if (
    files.length > 0 ||
    websites.length > 0 ||
    chatMode === 'rag' ||
    chatMode === 'function-calling'
  ) {
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
      <ChatMessageInputModeBtn chatMode={chatMode} onSetChatMode={onSetChatMode} />

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
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          flexWrap="wrap"
          sx={{
            display: websites.length === 0 ? 'none' : 'flex',
            width: '100%',
            mt: 0.75,
            mb: 0.5,
          }}
        >
          {websites.map((website, index) => (
            <ChatMessageInputWeb
              key={index}
              id={index}
              website={website}
              onRemoveWebsite={handleRemoveWebsite}
            />
          ))}
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          flexWrap="wrap"
          sx={{
            display: chatMode === 'rag' || chatMode === 'function-calling' ? 'flex' : 'none',
            width: '100%',
            mt: 0.75,
            mb: 0.5,
          }}
        >
          {chatMode === 'rag' && (
            <ChatMessageInputKb kb={selectedKbName} onOpenKbPopover={handleClickOpenKbPopover} />
          )}
          {chatMode === 'function-calling' && (
            <ChatMessageInputTool
              selectedTools={selectedTools}
              onOpenToolPopover={handleClickOpenToolPopover}
            />
          )}
        </Stack>
        <Input
          className="llm-input"
          multiline
          maxRows={10}
          // disabled={disabled}
          fullWidth
          value={message}
          disableUnderline
          // onBlur={() => handleInputFocus(false)}
          // onFocus={() => handleInputFocus(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setMessage(e.target.value);
            handleOpenKbOrWebPopover(e);
          }}
          placeholder="Enter a prompt"
          endAdornment={
            <Stack direction="row" sx={{ mr: 1.25, '& > *': { mx: 0.25 } }} alignItems="center">
              <UploadIconButton
                onClick={() => {}}
                disabled={chatMode !== 'open-chat'}
                onDrop={handleDrop}
              />
              <IconButton disabled={disabled} size="small" onClick={() => {}}>
                <Icon icon={attach2Fill} width={20} height={20} />
              </IconButton>
              {/* <IconButton disabled={disabled} size="small">
                <Icon icon={micFill} width={20} height={20} />
              </IconButton> */}

              <IconButton
                ref={buttonRef}
                size="small"
                sx={{ width: 30, height: 30 }}
                onClick={handleClickOpenWebPopover}
              >
                <Iconify width={18} icon="mdi:web-plus" />
              </IconButton>
            </Stack>
          }
          sx={{ pb: 0.5 }}
        />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Button
        size="small"
        variant="text"
        color="primary"
        onClick={handleSend}
        disabled={message.trim().length === 0 || status === 'running'}
        startIcon={
          <Icon
            // icon={status === 'running' ? 'carbon:stop-filled' : 'carbon:stop-filled'}
            icon={status === 'running' ? 'carbon:stop-filled' : 'ic:round-send'}
            width={22}
            height={22}
            color={message.trim().length === 0 ? '' : sendBtnColorSets[chatMode]}
          />
        }
        sx={{
          width: 38,
          height: 38,
          minWidth: 38,
          maxWidth: 38,
          borderRadius: 5,
          mx: 1,
          mr: 0.75,
          '& .MuiButton-startIcon': { mx: -4 },
        }}
      />

      {/* <IconButton
        disabled={message.trim().length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75 }}
      >
        <Icon color={sendBtnColorSets[chatMode]} icon="ic:round-send" width={24} height={24} />
      </IconButton> */}

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />

      <ChatMessageInputWebPopover
        url={message.startsWith('#') ? message.slice(1) : ''}
        moveUpper={websites.length > 0 || chatMode === 'rag'}
        anchorWidth={anchorWidth}
        openPopover={openWebPopover}
        onClosePopover={handleCloseWebPopover}
        onAddWebsite={handleSetAddWebsite}
      />

      <ChatMessageInputKbPopover
        searchText={message.slice(1)}
        selectedIndex={selectedKbIndex}
        moveUpper={websites.length > 0 || chatMode === 'rag'}
        anchorWidth={anchorWidth}
        openPopover={openKbPopover}
        onClosePopover={handleCloseKbPopover}
        onSelectIndex={onSelectIndex}
      />

      <ChatMessageInputToolPopover
        searchText={message.slice(1)}
        selectedTools={selectedTools}
        moveUpper={websites.length > 0 || chatMode === 'function-calling'}
        anchorWidth={anchorWidth}
        openPopover={openToolPopover}
        onClosePopover={handleCloseToolPopover}
        onSelectTools={onSelectTools}
      />
    </Box>
  );
}
