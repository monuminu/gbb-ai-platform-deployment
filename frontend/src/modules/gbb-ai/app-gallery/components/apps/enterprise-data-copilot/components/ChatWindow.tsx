import Stack from '@mui/material/Stack';

// project import
import uuidv4 from 'src/utils/uuidv4';

import { useFetchTools } from 'src/api/tool';
import { makeApiRequest, onComposeRequest } from 'src/api/gpt';

import {
  Message,
  SendMessage,
  Participant,
  Conversation,
  IConfiguration,
  SendTextFuncProps,
} from 'src/types/chat';

import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

const USER = { id: 'user', name: 'Admin' };
const ASSISTANTS = [{ id: 'assistant', name: 'GPT' }];

// ----------------------------------------------------------------------

type Props = {
  chatMode: string;
  messages: Message[];
  selectedIndex: string;
  selectedToolNames: string[];
  chatStatus: 'idle' | 'running';
  configurations: IConfiguration;
  onSelectIndex: (index: string) => void;
  onSelectTools: (tools: string[]) => void;
  onSetStatus: (newStatus: 'idle' | 'running') => void;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
  onUpdateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatWindow({
  chatStatus,
  chatMode,
  messages,
  configurations,
  selectedIndex,
  selectedToolNames,
  onSetStatus,
  onSelectIndex,
  onSelectTools,
  onSetChatMode,
  onUpdateMessages,
  onOpenRagSourcePopover,
}: Props) {
  const { tools } = useFetchTools();

  const selectedTools = tools.filter(
    (tool) => selectedToolNames.includes(tool.id) && tool.meta.trim() !== ''
  );

  const selectedToolDefinitions = tools
    .filter((tool) => selectedToolNames.includes(tool.id) && tool.meta.trim() !== '')
    .map((tool) => JSON.parse(tool.meta));

  // console.log(selectedToolDefinitions);
  // console.log(selectedTools);

  const messagesToInclude = configurations[`${chatMode}-Past messages included`];

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
      log_timestamp,
      attachments,
      thoughts,
    } as Message;

    // console.log('thoughts:', thoughts);

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
              onSetStatus('running');
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
                indexName: selectedIndex,
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
              ...(thoughts && { thoughts }),
              ...(tmpFunctions && { function_calls: tmpFunctions }),
            },
          ];
        }
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId === 'assistant') {
          return [...prev.slice(0, -1), newMessage];
        }
        if (mode === 'new' && senderId === 'user') {
          onSetStatus('running');
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
            indexName: selectedIndex,
            shouldStream: configurations[`${chatMode}-Should stream`],
            aoaiResourceName: configurations[`${chatMode}-Deployment`],
            systemPrompt: configurations[`${chatMode}-System message`],
            selectedTools,
          });
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
    thoughts = [],
    status = 'idle',
  }: SendTextFuncProps) => {
    onSetStatus(status as 'idle' | 'running');
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
      thoughts,
    });
  };

  return (
    <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
      <ChatMessageList
        conversation={conversation}
        chatMode={chatMode}
        onSend={handleSendText}
        onSetChatMode={onSetChatMode}
        onOpenRagSourcePopover={onOpenRagSourcePopover}
      />

      <ChatMessageInput
        disabled
        status={chatStatus}
        chatMode={chatMode}
        onSend={handleSendText}
        participants={participants}
        onSetChatMode={onSetChatMode}
        onSelectIndex={onSelectIndex}
        onSelectTools={onSelectTools}
        selectedTools={selectedToolNames}
        selectedKbIndex={selectedIndex}
      />
    </Stack>
  );
}
