import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { ICustomGpt } from 'src/types/app';
import { Conversation } from 'src/types/chat';

import ChatMessageItem from './ChatMessageItem';
import ChatWelcomeCard from './ChatWelcomeCard';
import ChatWelcomeTitle from './ChatWelcomeTitle';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
// const regex2 = /\!\[.*?\]\((.*?)\)/g;
const regex2 = /!\[.*?\]\((.*?)\)/g;

// ----------------------------------------------------------------------

type ChatMessageListProps = {
  customGpts: ICustomGpt[];
  conversation: Conversation;
  currentGpt: ICustomGpt | null;
  onSetCurrentGpt: (gpt: ICustomGpt | null) => void;
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatMessageList({
  customGpts,
  conversation,
  currentGpt,
  onSetCurrentGpt,
  onOpenRagSourcePopover,
}: ChatMessageListProps) {
  const { messagesEndRef } = useMessagesScroll(conversation.messages);

  const images = conversation.messages
    .filter((message) => {
      if (!message.body) return false;
      const match = message.body.match(regex);
      const url = match ? match[0] : '';
      return !!url;
    })
    .map((message) => {
      if (!message.body) return { src: '' };
      const match = message.body.match(regex);
      const url = match ? match[0] : '';

      // let match2;
      // const imageLinks = [];
      // while ((match2 = regex2.exec(message.body)) !== null) {
      //   if (match2[1] !== url) imageLinks.push(match2[1]);
      // }
      const imageLinks = [];
      let match2 = regex2.exec(message.body);
      while (match2 !== null) {
        if (match2[1] !== url) imageLinks.push(match2[1]);
        match2 = regex2.exec(message.body);
      }
      return [{ src: url }, ...imageLinks.map((link) => ({ src: link }))];
    })
    .flat();

  conversation.messages.forEach((message) => {
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
      <Scrollbar ref={messagesEndRef} sx={{ py: 2, px: 1.25, height: 1 }}>
        <Box sx={{ mx: 1, mb: 8, mt: 0 }}>
          <ChatWelcomeTitle title="Agent Workbench" />

          <Typography variant="subtitle2" sx={{ px: 0, mt: 4, mb: 2, textAlign: 'center' }}>
            Select a custom GPT
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              width: '100%',
            }}
          >
            {customGpts.slice(0, 6).map((_gpt) => (
              <ChatWelcomeCard key={_gpt.id} customGpt={_gpt} onSetCurrentGpt={onSetCurrentGpt} />
            ))}
          </Box>
        </Box>

        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            avatarName={message.avatarName || 'Copilot'}
            avatarUrl={message.avatarUrl || ''}
            conversation={conversation}
            isLastMessage={index === conversation.messages.length - 1}
            onOpenLightbox={handleOpenLightbox}
            onOpenRagSourcePopover={onOpenRagSourcePopover}
          />
        ))}
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
