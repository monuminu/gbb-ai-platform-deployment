import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import { EmptyChatImage } from 'src/assets';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Message, Participant } from 'src/types/chat';

import ChatBenchMessageItem from './custom-gpt-chat-bench-message-item';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
// const regex2 = /\!\[.*?\]\((.*?)\)/g;
const regex2 = /!\[.*?\]\((.*?)\)/g;

// ----------------------------------------------------------------------

type Props = {
  avatarUrl: string;
  messages: Message[];
  participants: Participant[];
  onOpenRagSourcePanel: (thoughts: any, selected: string) => void;
};

export default function ChatBenchMessageList({
  avatarUrl,
  messages = [],
  participants,
  onOpenRagSourcePanel,
}: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const images = messages
    .filter((message) => {
      if (!message.body) return false;
      // console.log(message.body);
      const match = message.body.match(regex);
      const url = match ? match[0] : '';
      return !!url;
    })
    .map((message) => {
      if (!message.body) return { src: '' };
      const match = message.body.match(regex);
      const url = match ? match[0] : '';

      const imageLinks = [];
      let match2 = regex2.exec(message.body);
      while (match2 !== null) {
        if (match2[1] !== url) imageLinks.push(match2[1]);
        match2 = regex2.exec(message.body);
      }
      return [{ src: url }, ...imageLinks.map((link) => ({ src: link }))];
    })
    .flat();

  messages.forEach((message) => {
    if (message.attachments !== undefined && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        images.push({ src: attachment.preview });
      });
    }
  });

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  return (
    <>
      {messages.length === 0 && (
        <Box
          sx={{
            height: 'calc(100% - 52px)',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Stack direction="column" sx={{ my: 'auto', alignItems: 'center' }}>
            <EmptyChatImage sx={{ width: 180, height: 180 }} />
            <Typography variant="h6" color="text.disabled" sx={{ mt: 0.5 }}>
              Chat with your GPT
            </Typography>
          </Stack>
        </Box>
      )}
      {messages.length > 0 && (
        <Scrollbar ref={messagesEndRef} sx={{ py: 2, px: 3, pb: 1, height: 'calc(100% - 52px)' }}>
          {messages.map((message) => (
            <ChatBenchMessageItem
              key={message.id}
              message={message}
              avatarUrl={avatarUrl}
              participants={participants}
              isLastMessage={messages.indexOf(message) === messages.length - 1}
              onOpenLightbox={handleOpenLightbox}
              onOpenRagSourcePanel={onOpenRagSourcePanel}
            />
          ))}
        </Scrollbar>
      )}

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
