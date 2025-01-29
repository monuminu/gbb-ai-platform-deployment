import Stack from '@mui/material/Stack';

import uuidv4 from 'src/utils/uuidv4';

import { useFetchTools } from 'src/api/tool';
import { makeApiRequest, onComposeRequest } from 'src/api/gpt';

import { ITool } from 'src/types/tool';
import {
  Message,
  SendMessage,
  Participant,
  Conversation,
  IConfiguration,
  IToolDefinition,
  SendTextFuncProps,
} from 'src/types/chat';

import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

const USER = { id: 'user', name: 'Admin' };
const ASSISTANTS = [{ id: 'assistant', name: 'GPT' }];

// ----------------------------------------------------------------------

type Props = {
  gptName: string;
  chatMode: string;
  avatarUrl: string;
  description: string;
  samplePrompts: string[];
  messages: Message[];
  configurations: IConfiguration;
  selectedIndex: string | undefined;
  functionList: string[] | undefined;
  sampleAttachments?: Record<string, string[]>;
  onUpdateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatWindow({
  gptName,
  chatMode,
  avatarUrl,
  description,
  samplePrompts,
  messages,
  onUpdateMessages,
  configurations,
  selectedIndex,
  functionList,
  sampleAttachments,
  onOpenRagSourcePopover,
}: Props) {
  const { tools } = useFetchTools();

  let selectedTools: ITool[] = [];
  let selectedToolDefinitions: IToolDefinition[] = [];

  if (functionList && functionList.length > 0) {
    selectedTools = tools.filter((tool) =>
      functionList.some((fl) => {
        const [id] = fl.split('<sep>');
        return id === tool.id && tool.meta.trim() !== '';
      })
    );
    selectedToolDefinitions = selectedTools.map((tool) => JSON.parse(tool.meta));
  }

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

    // console.log(newMessage);

    onUpdateMessages((prev) => {
      const existedMsgIndex = prev.findIndex((msg) => msg.id === messageId);
      if (!message && attachments?.length === 0) return [...prev];
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
              // console.log('message', message);
              // console.log('function_calls', function_calls);

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
              ...(tmpFunctions && { function_calls: tmpFunctions }),
              ...(thoughts && { thoughts }),
            },
          ];
        }
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId === 'assistant') {
          return [...prev.slice(0, -1), newMessage];
        }
        if (mode === 'new' && senderId === 'user') {
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
            indexName: selectedIndex,
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
    uuid = undefined,
    timestamp = undefined,
    attachments = [],
    thoughts = [],
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
      ddb_uuid: uuid,
      log_timestamp: timestamp,
      attachments,
      thoughts,
    });
  };

  return (
    <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
      <ChatMessageList
        gptName={gptName}
        avatarUrl={avatarUrl}
        description={description}
        samplePrompts={samplePrompts}
        conversation={conversation}
        onSend={handleSendText}
        attachments={sampleAttachments}
        onOpenRagSourcePopover={onOpenRagSourcePopover}
      />

      <ChatMessageInput
        samplePrompts={samplePrompts}
        participants={participants}
        onSend={handleSendText}
        disabled
        chatMode={chatMode}
      />
    </Stack>
  );
}
