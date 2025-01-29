import Box from '@mui/material/Box';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Message, Participant } from 'src/types/chat';

import CopilotMessageItem from './custom-gpt-copilot-message-item';

// ----------------------------------------------------------------------

type Props = {
  messages: Message[];
  participants: Participant[];
  onSend: Function;
  callBack?: Function;
};

export default function CopilotMessageList({
  messages = [],
  participants,
  onSend,
  callBack,
}: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 2.25, py: 3, height: 1 }}>
        <Box>
          {messages.map((message) => (
            <CopilotMessageItem
              key={message.id}
              message={message}
              participants={participants}
              isLastMessage={messages.indexOf(message) === messages.length - 1}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
              onSend={onSend}
              callBack={callBack}
            />
          ))}
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
