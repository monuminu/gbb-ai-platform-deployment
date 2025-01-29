import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import downloadFill from '@iconify/icons-eva/download-fill';

// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

// project imports
import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';

import { handleDaCall } from 'src/api/app-gallery';
import { makeApiRequest, onComposeRequest } from 'src/api/gpt';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { CustomFile } from 'src/components/upload';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import {
  Message,
  SendMessage,
  Participant,
  Conversation,
  IConfiguration,
  SendTextFuncProps,
} from 'src/types/chat';

import DataReport from './data-report';
import FileList from './data/file-list';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import DataUploadDialog from './data-upload-dialog';
import DataCardActionSelected from './data-card-action-selected';

// ----------------------------------------------------------------------

const USER = { id: 'user', name: 'Admin' };
const DATATYPES = ['File', 'MySQL', 'PostgreSQL'];
const ASSISTANTS = [{ id: 'assistant', name: 'GPT' }];

// ----------------------------------------------------------------------

type Props = {
  apiUrl: string;
  messages: Message[];
  onUpdateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  configurations: IConfiguration;
  selectedIndex?: string;
  chatMode: string;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
  isNavHorizontal: Boolean;
};

export default function ChatWindow({
  apiUrl,
  messages,
  onUpdateMessages,
  configurations,
  selectedIndex,
  chatMode,
  onSetChatMode,
  isNavHorizontal,
}: Props) {
  const theme = useTheme();

  const popover = usePopover();

  const upload = useBoolean();
  const openCompose = useBoolean();

  const [files, setFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState('File');
  const [selected, setSelected] = useState<string[]>([]);
  const [reportMessage, setReportMessage] = useState<Message>();
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [reportSrcMessages, setReportSrcMessages] = useState<Message[]>([]);

  const messagesToInclude = configurations[`${chatMode}-Past messages included`];

  const handleUpdateMessage = useCallback(
    (messageId: string, content: string, status: string) => {
      onUpdateMessages((prev) => {
        const existedMsgIndex = prev.findIndex((msg) => msg.id === messageId);
        if (existedMsgIndex === -1) return [...prev];

        const newArr = [...prev];
        newArr[existedMsgIndex] = {
          ...newArr[existedMsgIndex],
          body: content,
          createdAt: new Date(),
          status,
        };
        return newArr;
      });
    },
    [onUpdateMessages]
  );

  // console.log(messages);

  const onSendMessage = (conversation: SendMessage) => {
    const {
      messageId,
      message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      log_timestamp,
      attachments,
    } = conversation;

    const newMessage = {
      id: messageId,
      body: message,
      query: message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      chatMode,
      log_timestamp,
      attachments,
      status: 'running',
    } as Message;

    onUpdateMessages((prev) => {
      const existedMsgIndex = prev.findIndex((msg) => msg.id === messageId);
      if (!message) return [...prev];
      if (existedMsgIndex === -1) {
        if (mode === 'attach') {
          if (message.startsWith('(SYS)function')) {
            const tmpMessage = {
              ...prev[prev.length - 1],
              body: message,
              function_calls,
            };
            if (message.startsWith('(SYS)function executed')) {
              makeApiRequest({
                mode: chatMode,
                onSend: handleSendText,
                request: onComposeRequest(
                  [...prev.slice(0, -1), tmpMessage],
                  chatMode,
                  messagesToInclude,
                  configurations
                ),
                indexName: selectedIndex,
                shouldStream: configurations[`${chatMode}-Should stream`],
                aoaiResourceName: configurations[`${chatMode}-Deployment`],
                systemPrompt: configurations[`${chatMode}-System message`],
              });
            }
            return [...prev.slice(0, -1), tmpMessage];
          }
          const tmpFunctions = prev[prev.length - 1].function_calls;
          return [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              body: message,
              ...(tmpFunctions && { function_calls: tmpFunctions }),
            },
          ];
        }
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId === 'assistant') {
          return [...prev.slice(0, -1), newMessage];
        }
        if (mode === 'insight' && senderId === 'user') {
          handleUpdateMessage(messageId, '', 'running');
          makeApiRequest({
            mode: chatMode,
            onSend: handleUpdateMessage,
            request: onComposeRequest([newMessage], chatMode, '0', configurations),
            shouldStream: configurations[`${chatMode}-Should stream`],
            aoaiResourceName: configurations[`${chatMode}-Deployment`],
            indexName: selectedIndex,
            systemPrompt: configurations[`${chatMode}-System message`],
            messageId,
          });
          return [...prev, newMessage];
        }
        if (mode === 'new' && senderId === 'user') {
          const selectedFiles = selectedFileNames.map((name) => {
            const file = files.find((f) => f.name === name);
            return file;
          }) as File[];
          handleUpdateMessage(messageId, '', 'running');
          handleDaCall(
            apiUrl,
            messageId,
            message,
            selectedFiles,
            handleUpdateMessage,
            configurations[`${chatMode}-Deployment`]
          );
          return [...prev, newMessage];
        }
        return [...prev, newMessage];
      }
      const newArr = [...prev];
      newArr[existedMsgIndex] = newMessage;
      return newArr;
    });
  };

  const participants = [ASSISTANTS[0] as Participant];

  const conversation = {
    id: '1',
    participants: [USER, ASSISTANTS[0]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages,
  } as Conversation;

  const handleSendText = ({
    content,
    senderId,
    mode,
    sources = [],
    function_calls = [],
    msgId = undefined,
    timestamp = undefined,
    attachments = [],
  }: SendTextFuncProps) => {
    onSendMessage({
      conversationId: '1',
      messageId: msgId === undefined ? uuidv4() : msgId,
      message: content,
      contentType: 'text',
      sources,
      function_calls,
      createdAt: new Date(),
      senderId,
      mode,
      chatMode,
      log_timestamp: timestamp,
      attachments,
    });
  };

  // console.log('selected: ', selected);

  const handleToggleReport = useCallback(
    (msgId: string) => {
      const _message = messages.find((msg) => msg.id === msgId);
      const _sourceMessages = messages.filter((message) =>
        _message?.sources?.map((source) => source.url).includes(message.id)
      );
      setReportMessage(_message);
      setReportSrcMessages(_sourceMessages);
      openCompose.onToggle();
    },
    [messages, openCompose]
  );

  const onSelectCard = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onGenerateInsights = useCallback(() => {
    const selectedMessages = messages
      .filter((message) => selected.includes(message.id))
      .map((message) => {
        const parsedBody = JSON.parse(message.body);
        // console.log(parsedBody.response);
        return {
          query: parsedBody.query,
          response: JSON.stringify(parsedBody.response),
        };
      });

    if (!selectedMessages.length) return;

    const prompt = `Analyze the following list of query-response pairs to identify patterns, anomalies, and insights. Provide a comprehensive summary of the findings, including any significant correlations, unexpected results, and potential areas for further investigation. Each query-response pair is related to sales data."

Query-Response Pairs:
${selectedMessages
  .map(
    (message, index) =>
      `${index + 1}. Query: "${message.query}"\n   Response: "${message.response}"`
  )
  .join('\n')}
    
Instructions:
- Identify key trends and insights from the provided query-response pairs.
- Highlight any significant changes or anomalies in the data.
- Suggest possible reasons for the patterns observed.
- Recommend areas for potential improvement or further analysis based on the insights gathered.

Please use the same language as the query.`;

    // console.log(prompt);

    handleSendText({
      content: prompt,
      senderId: 'user',
      mode: 'insight',
      sources: messages
        .filter((message) => selected.includes(message.id))
        .map((message) => ({
          label: message.query as string,
          url: message.id,
        })),
    });

    setSelected([]);
    /* eslint-disable-next-line */
  }, [selected, messages]);

  const onSelectAll = useCallback((checked: boolean, inputValue: string[]) => {
    if (checked) {
      setSelected(inputValue);
      return;
    }
    setSelected([]);
  }, []);

  const handleSetFiles = useCallback((acceptedFiles: CustomFile[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const handleSetSelectedFiles = useCallback((_selected: string[]) => {
    setSelectedFileNames(_selected);
  }, []);

  const handleQuery = useCallback(
    (messageId: string, query: string) => {
      handleUpdateMessage(messageId, '', 'running');
      const selectedFiles = selectedFileNames.map((name) => {
        const file = files.find((f) => f.name === name);
        return file;
      }) as File[];
      handleDaCall(
        apiUrl,
        messageId,
        query,
        selectedFiles,
        handleUpdateMessage,
        configurations[`${chatMode}-Deployment`]
      );
    },
    [apiUrl, chatMode, configurations, selectedFileNames, handleUpdateMessage, files]
  );

  const handleChangeDataType = useCallback(
    (newValue: string) => {
      popover.onClose();
      setDataType(newValue);
      if (newValue === 'File') {
        upload.onTrue();
      }
    },
    [upload, popover]
  );

  // console.log(selectedFileNames);

  const componentHeight = isNavHorizontal ? 'calc(100vh - 366px)' : 'calc(100vh - 206px)';

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack sx={{ width: 1, overflow: 'hidden' }}>
        <Grid container spacing={2.5} sx={{ p: 0.5, pt: 0 }}>
          <Grid xs={12} md={5} sx={{ width: '100%', height: componentHeight }}>
            <Card sx={{ height: 1, borderRadius: 0.75 }}>
              <CardHeader
                title="Data"
                sx={{
                  mt: -1,
                  ml: -0.5,
                  mr: 0.5,
                  pb: 2,
                  borderBottom: `dashed 1px ${alpha(theme.palette.grey[500], 0.2)}`,
                }}
                action={
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <ButtonBase
                      onClick={popover.onOpen}
                      sx={{
                        pl: 1,
                        py: 0.5,
                        pr: 0.5,
                        mt: 0.25,
                        borderRadius: 0.75,
                        typography: 'subtitle2',
                        color: theme.palette.background.default,
                        bgcolor: theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dataType}

                      <Iconify
                        width={16}
                        icon={
                          popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                        }
                        sx={{ ml: 0.5 }}
                      />
                    </ButtonBase>
                  </Stack>
                }
              />
              <Scrollbar
                sx={{
                  flexDirection: 'row',
                  height: 'calc(100vh - 290px)',
                  overflowX: 'hidden',
                }}
              >
                <FileList dataFiles={files} onSetselectedFiles={handleSetSelectedFiles} />
              </Scrollbar>
            </Card>
          </Grid>

          <Grid xs={12} md={7} sx={{ width: '100%', height: componentHeight }}>
            <Card sx={{ height: 1, borderRadius: 0.75 }}>
              <CardHeader
                title="AI Analyzer"
                sx={{
                  mt: -1,
                  pb: 2,
                  ml: -0.5,
                  mr: 0.5,
                  borderBottom: `dashed 1px ${alpha(theme.palette.grey[500], 0.2)}`,
                }}
                action={
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {}}
                    startIcon={<Icon icon={downloadFill} />}
                    sx={{ height: 30, mt: 0.25 }}
                  >
                    Download
                  </Button>
                }
              />

              <ChatMessageList
                conversation={conversation}
                onSendQuery={handleQuery}
                selectedCards={selected}
                onSelectCard={onSelectCard}
                onOpenReport={handleToggleReport}
              />
            </Card>
          </Grid>
        </Grid>

        <ChatMessageInput
          participants={participants}
          onSend={handleSendText}
          disabled
          chatMode={chatMode}
          onSetChatMode={onSetChatMode}
        />
      </Stack>

      {!!selected?.length && (
        <DataCardActionSelected
          numSelected={selected.length}
          rowCount={messages.length}
          selected={selected}
          onSelectAllItems={(checked) =>
            onSelectAll(
              checked,
              messages.map((message) => message.id)
            )
          }
          action={
            <>
              {/* <Button
                size="small"
                color="error"
                variant="contained"
                startIcon={<Iconify icon="gravity-ui:trash-bin" width={18} />}
                onClick={onOpenConfirm}
                sx={{ mr: 1 }}
              >
                Delete
              </Button> */}

              <Button
                color="primary"
                size="small"
                variant="contained"
                startIcon={<Iconify icon="ic:twotone-insights" width={16} sx={{ mr: -0.25 }} />}
                onClick={onGenerateInsights}
                sx={{ borderRadius: 0.5 }}
              >
                Insights
              </Button>
            </>
          }
        />
      )}

      {openCompose.value && (
        <DataReport
          onCloseCompose={openCompose.onFalse}
          insightMessage={reportMessage}
          sourceMessages={reportSrcMessages}
        />
      )}

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {DATATYPES.map((type) => (
          <MenuItem
            key={type}
            disabled={type !== 'File'}
            selected={type === dataType}
            onClick={() => handleChangeDataType(type)}
          >
            {type}
          </MenuItem>
        ))}
      </CustomPopover>

      <DataUploadDialog onSetFiles={handleSetFiles} open={upload.value} onClose={upload.onFalse} />
    </Box>
  );
}
