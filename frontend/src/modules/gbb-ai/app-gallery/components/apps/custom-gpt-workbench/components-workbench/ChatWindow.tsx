import Stack from '@mui/material/Stack';

// project import
import uuidv4 from 'src/utils/uuidv4';

import { useFetchTools } from 'src/api/tool';
import { makeApiRequest, onComposeRequest } from 'src/api/gpt';

import { ITool } from 'src/types/tool';
import { ICustomGpt } from 'src/types/app';
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
  customGpts: ICustomGpt[];
  currentGpt: ICustomGpt | null;
  setCurrentGpt: (_gpt: ICustomGpt | null) => void;
  messages: Message[];
  chatMode: string;
  onUpdateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  configurations: IConfiguration;
  selectedIndex: string;
  selectedToolNames: string[];
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatWindow({
  customGpts,
  currentGpt,
  setCurrentGpt,
  messages,
  chatMode,
  onUpdateMessages,
  configurations,
  selectedIndex,
  selectedToolNames,
  onOpenRagSourcePopover,
}: Props) {
  const { tools } = useFetchTools();

  let selectedTools: ITool[] = [];
  let selectedToolDefinitions: IToolDefinition[] = [];

  if (selectedToolNames && selectedToolNames.length > 0) {
    selectedTools = tools.filter((tool) =>
      selectedToolNames.some((fl) => {
        const [id] = fl.split('<sep>');
        return id === tool.id && tool.meta.trim() !== '';
      })
    );
    selectedToolDefinitions = selectedTools.map((tool) => JSON.parse(tool.meta));
  }

  // console.log(selectedTools);
  // console.log(selectedToolDefinitions);
  
  const handleSetCurrentGpt = (gpt: ICustomGpt | null) => {
    setCurrentGpt(gpt);
  };

  // console.log(currentGpt);

  const messagesToInclude = configurations[`${chatMode}-Past messages included`];

  // const onComposeRequest = (_messages: Message[]) => {
  //   const gptMessages: any[] = [];
  //   _messages.slice(-messagesToInclude - 1).forEach((message) => {
  //     const { body, senderId, function_calls, attachments } = message;

  //     if (function_calls !== undefined && function_calls.length > 0) {
  //       if (!body.startsWith('(SYS)function')) {
  //         gptMessages.push({ content: body, role: 'assistant', attachments });
  //       }

  //       function_calls.forEach((function_call: any) => {
  //         const { funcName, funcArgs, results } = function_call;

  //         if (chatMode === 'function-calling') {
  //           gptMessages.push({
  //             content: '',
  //             role: 'assistant',
  //             function_call: { name: funcName, arguments: funcArgs },
  //           });
  //         }

  //         if (results && results.length > 0)
  //           gptMessages.push({
  //             content: results,
  //             role: chatMode === 'function-calling' ? 'function' : 'assistant',
  //             name: funcName,
  //           });
  //       });
  //     } else {
  //       gptMessages.push({
  //         content: body,
  //         role: senderId === 'user' ? 'user' : 'assistant',
  //         attachments,
  //       });
  //     }
  //   });

  //   return formRequest({
  //     chatMode,
  //     messages: gptMessages,
  //     configurations,
  //   });
  // };

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
      avatarName: currentGpt?.name || '',
      avatarUrl: currentGpt?.coverUrl || '',
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
                // request: onComposeRequest([...prev.slice(0, -1), tmpMessage]),
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
          makeApiRequest({
            mode: chatMode,
            onSend: handleSendText,
            request: onComposeRequest(
              [...prev.slice(0, -1), newMessage],
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
        customGpts={customGpts}
        conversation={conversation}
        currentGpt={currentGpt}
        onSetCurrentGpt={handleSetCurrentGpt}
        onOpenRagSourcePopover={onOpenRagSourcePopover}
      />

      <ChatMessageInput
        customGpts={customGpts}
        participants={participants}
        onSend={handleSendText}
        disabled
        chatMode={chatMode}
        currentGpt={currentGpt}
        onSetCurrentGpt={handleSetCurrentGpt}
      />
    </Stack>
  );
}
