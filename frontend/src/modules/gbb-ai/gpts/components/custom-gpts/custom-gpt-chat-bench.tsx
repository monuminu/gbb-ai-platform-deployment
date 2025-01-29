import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import uuidv4 from 'src/utils/uuidv4';

import { useFetchTools } from 'src/api/tool';
import { makeApiRequest, onComposeRequest, getConfiguration } from 'src/api/gpt';

import SvgColor from 'src/components/svg-color';
import RagSourceDialog from 'src/components/rag-source-panel/rag-source-dialog';

import { ITool } from 'src/types/tool';
import { IAoaiResourceItem } from 'src/types/azure-resource';
import {
  Message,
  SendMessage,
  Conversation,
  IConfiguration,
  IToolDefinition,
  SendTextFuncProps,
} from 'src/types/chat';

import ChatBenchInput from './custom-gpt-chat-bench-input';
import ChatBenchMessageList from './custom-gpt-chat-bench-message-list';

// ----------------------------------------------------------------------

type Props = {
  avatarUrl: string;
  instruction: string;
  functionList?: string[];
  knowledgeBase?: string;
};

export default function CustomGptNewEditChatBench({
  avatarUrl,
  instruction,
  functionList,
  knowledgeBase,
}: Props) {
  const { tools } = useFetchTools();

  let chatMode = 'open-chat';
  let indexName: string | undefined;
  let selectedTools: ITool[] = [];
  let selectedToolDefinitions: IToolDefinition[] = [];

  if (functionList && functionList.length > 0) {
    chatMode = 'function-calling';
    selectedTools = tools.filter((tool) =>
      functionList.some((fl) => {
        const [id] = fl.split('<sep>');
        return id === tool.id && tool.meta.trim() !== '';
      })
    );
    selectedToolDefinitions = selectedTools.map((tool) => JSON.parse(tool.meta));
  } else if (knowledgeBase && knowledgeBase.length > 0) {
    chatMode = 'rag';
    indexName = knowledgeBase.split('<sep>')[1] || undefined;
  }
  // console.log(chatMode);
  // console.log(indexName);

  const openRagThoughts = useBoolean();

  const [ragThoughts, setRagThoughts] = useState<any>();
  const [messages, onUpdateMessages] = useState<Message[]>([]);
  const [selectedRagSource, setSelectedRagSource] = useState<string>('All');

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

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  const [configurations] = useState<IConfiguration>({
    ...initialConfigurations,
    [`${chatMode.toLowerCase()}-System message`]: instruction,
  });

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
      thoughts,
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
      thoughts,
    } as Message;

    onUpdateMessages((prev) => {
      const existedMsgIndex = prev.findIndex((msg) => msg.id === messageId);
      if (!message) return [...prev];
      if (existedMsgIndex === -1) {
        if (mode === 'attach') {
          if (message.startsWith('(SYS)function')) {
            // console.log('function_calls', function_calls);
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
                  configurations,
                  [],
                  selectedToolDefinitions
                ),
                shouldStream: configurations[`${chatMode}-Should stream`],
                aoaiResourceName: configurations[`${chatMode}-Deployment`],
                systemPrompt: configurations[`${chatMode}-System message`],
                selectedTools,
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
              ...(thoughts && { thoughts }),
            },
          ];
        }
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId === 'assistant') {
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
                configurations,
                [],
                selectedToolDefinitions
              ),
              shouldStream: configurations[`${chatMode}-Should stream`],
              aoaiResourceName: configurations[`${chatMode}-Deployment`],
              indexName,
              systemPrompt: configurations[`${chatMode}-System message`],
              selectedTools,
            });
          } else {
            makeApiRequest({
              mode: chatMode,
              onSend: handleSendText,
              request: onComposeRequest(
                [...prev, newMessage],
                chatMode,
                messagesToInclude,
                configurations,
                [],
                selectedToolDefinitions
              ),
              shouldStream: configurations[`${chatMode}-Should stream`],
              aoaiResourceName: configurations[`${chatMode}-Deployment`],
              indexName,
              systemPrompt: configurations[`${chatMode}-System message`],
              selectedTools,
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
    onUpdateMessages([]);
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
    thoughts = [],
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
        thoughts,
      },
      buttonPrompt
    );
  };

  const handleOpenRagSourcePanel = useCallback(
    (thoughts: any, selected: string) => {
      setRagThoughts(thoughts);
      setSelectedRagSource(selected);
      openRagThoughts.onTrue();
    },
    [openRagThoughts]
  );

  return (
    <Card sx={{ height: 'calc(100% + 52px)' }}>
      <CardHeader
        title="Chat bench"
        sx={{ mt: -1, mb: 2 }}
        action={
          <Tooltip title="Clear histroy">
            <IconButton size="small" color="default" onClick={() => hanldeClearHistory()}>
              <SvgColor src="/assets/icons/modules/ic-sweep.svg" sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Tooltip>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', mb: 0 }} />

      <Box sx={{ height: 'calc(100% - 62px)' }}>
        <ChatBenchMessageList
          avatarUrl={avatarUrl}
          messages={conversation?.messages}
          participants={[contacts[1]]}
          onOpenRagSourcePanel={handleOpenRagSourcePanel}
        />

        <ChatBenchInput onSend={handleSendText} />

        <RagSourceDialog
          open={openRagThoughts.value}
          onClose={openRagThoughts.onFalse}
          ragThoughts={ragThoughts}
          selectedSource={selectedRagSource}
        />
      </Box>
    </Card>
  );
}
