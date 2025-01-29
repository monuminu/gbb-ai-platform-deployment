import { useState, useEffect } from 'react';
import cross2 from '@iconify/icons-radix-icons/cross-2';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import uuidv4 from 'src/utils/uuidv4';

import { makeApiRequest, onComposeRequest, getConfiguration } from 'src/api/gpt';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import { IAoaiResourceItem } from 'src/types/azure-resource';
import {
  Message,
  IChatMode,
  SendMessage,
  Conversation,
  IConfiguration,
  SendTextFuncProps,
} from 'src/types/chat';

import CopilotMessageList from './custom-gpt-copilot-message-list';
import FunctionDetailsCopilotInput from './custom-gpt-copilot-input';
import { initialMessges } from './custom-gpt-copilot-initial-messages';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  trigger: string;
  context: string;
  //
  onClose: VoidFunction;
  callBack?: Function;
};

export default function CustomGptCopilot({
  trigger,
  context,
  open,
  onClose,
  callBack,
  ...other
}: Props) {
  const chatMode: IChatMode = 'open-chat';

  const [messages, onUpdateMessages] = useState<Message[]>([]);

  const [currentTrigger, setCurrentTrigger] = useState(trigger);

  useEffect(() => {
    if (!!trigger && trigger !== currentTrigger) {
      const updatedMessages: Message[] = initialMessges(context);
      onUpdateMessages(updatedMessages);
      setCurrentTrigger(trigger);
    }
  }, [trigger, context, currentTrigger]);

  const aoaiCredentials: IAoaiResourceItem[] = getStorage(AOAI_CREDENTIAL_KEY);

  const aoaiResourceNames = aoaiCredentials ? aoaiCredentials.map((item) => item.resourceName) : [];
  const primaryResources = aoaiCredentials ? aoaiCredentials.filter((item) => item.primary) : [];
  const primaryResourceName =
    primaryResources && primaryResources.length > 0 ? primaryResources[0].resourceName : '';
  let intialResourceName = '';
  if (primaryResourceName.length > 0) {
    intialResourceName = primaryResourceName;
  } else if (aoaiResourceNames && aoaiResourceNames.length > 0) {
    intialResourceName = aoaiResourceNames[0];
  }

  const configurations: IConfiguration = getConfiguration(intialResourceName);

  const messagesToInclude = configurations[`${chatMode}-Past messages included`];

  const onSendMessage = (conversation: SendMessage, buttonPrompt?: string) => {
    const {
      messageId,
      message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      ddb_uuid,
      log_timestamp,
      attachments,
    } = conversation;

    const newMessage = {
      id: messageId,
      body: message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      chatMode,
      ddb_uuid,
      log_timestamp,
      attachments,
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
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId === "assistant") {
          return [...prev.slice(0, -1), newMessage];
        }
        if (mode === 'new' && senderId === 'user') {
          if (buttonPrompt) {
            makeApiRequest({
              mode: chatMode,
              onSend: handleSendText,
              request: onComposeRequest(
                [...prev, newMessage],
                chatMode,
                messagesToInclude,
                configurations
              ),
              shouldStream: configurations[`${chatMode}-Should stream`],
              aoaiResourceName: configurations[`${chatMode}-Deployment`],
              buttonContent: buttonPrompt,
              systemPrompt: configurations[`${chatMode}-System message`],
            });
          } else {
            makeApiRequest({
              mode: chatMode,
              onSend: handleSendText,
              request: onComposeRequest(
                [...prev, newMessage],
                chatMode,
                messagesToInclude,
                configurations
              ),
              shouldStream: configurations[`${chatMode}-Should stream`],
              aoaiResourceName: configurations[`${chatMode}-Deployment`],
              systemPrompt: configurations[`${chatMode}-System message`],
            });
          }
          return [...prev, newMessage];
        }
        return [...prev, newMessage];
      }
      const newArr = [...prev];
      newArr[existedMsgIndex] = newMessage;
      return newArr;
    });
  };

  const contacts = [
    {
      id: 'user',
      avatarUrl: '/assets/avatars/avatar_default.jpg',
      name: 'Admin',
      username: 'Admin',
    },
    {
      id: 'assistant',
      avatarUrl: '/assets/avatars/avatar_2.jpg',
      name: 'Copilot',
      username: 'Copilot',
    },
  ];

  const conversation = {
    id: '1',
    participants: contacts,
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages,
  } as Conversation;

  const hanldeClearHistory = () => {
    onUpdateMessages((prev) => [prev[0]]);
  };

  const handleSendText = ({
    content,
    senderId,
    mode,
    sources = [],
    function_calls = [],
    msgId = undefined,
    uuid = undefined,
    timestamp = undefined,
    attachments = [],
    buttonPrompt = undefined,
  }: SendTextFuncProps) => {
    onSendMessage(
      {
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
        ddb_uuid: uuid,
        log_timestamp: timestamp,
        attachments,
      },
      buttonPrompt
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: { xs: 1, sm: 400 } } }}
      {...other}
    >
      <Stack spacing={2.5} justifyContent="center" sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="img"
              src="/assets/icons/modules/ic_copilot.svg"
              sx={{ width: 26, height: 26 }}
            />

            <Typography variant="h6"> Copilot </Typography>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" flexGrow={1} spacing={0.25}>
            <Tooltip title="Clear histroy">
              <IconButton size="small" color="default" onClick={hanldeClearHistory}>
                <SvgColor src="/assets/icons/modules/ic-sweep.svg" sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>

            <IconButton size="small" onClick={onClose} sx={{ width: 30 }}>
              <Iconify icon={cross2} width={19} height={19} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'solid', mb: 0 }} />

      <CopilotMessageList
        messages={conversation?.messages}
        participants={[contacts[1]]}
        onSend={handleSendText}
        callBack={callBack}
      />

      <FunctionDetailsCopilotInput conversationId={conversation.id} onSend={handleSendText} />
    </Drawer>
  );
}
