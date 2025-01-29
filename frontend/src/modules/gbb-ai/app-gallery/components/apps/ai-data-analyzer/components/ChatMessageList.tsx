import { Box } from '@mui/material';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Conversation } from 'src/types/chat';

import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
// const regex2 = /\!\[.*?\]\((.*?)\)/g;
const regex2 = /!\[.*?\]\((.*?)\)/g;

type ChatMessageListProps = {
  conversation: Conversation;
  onSendQuery: (messageId: string, query: string) => void;
  selectedCards: string[];
  onSelectCard: (messageId: string) => void;
  onOpenReport?: (msgId: string) => void;
};

export default function ChatMessageList({
  conversation,
  onSendQuery,
  selectedCards,
  onSelectCard,
  onOpenReport,
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
  // console.log(images);attachments?: { type: string; url: string }[]; url: file.preview

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  // console.log(conversation.messages);

  return (
    <>
      {conversation.messages.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            m: 2.5,
          }}
        >
          <EmptyContent
            filled
            title="Start analyzing by"
            sx={{ py: 12, width: '100%' }}
            imgUrl="/assets/icons/empty/ic_analysis.svg"
            description="Adding data & asking questions"
          />
        </Box>
      )}
      <Scrollbar ref={messagesEndRef} sx={{ pt: 2, pb: 1, px: 2.5, height: 'calc(100vh - 286px)' }}>
        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            onOpenLightbox={handleOpenLightbox}
            onSendQuery={onSendQuery}
            selected={selectedCards.includes(message.id)}
            onSelect={() => onSelectCard(message.id)}
            onOpenReport={onOpenReport}
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
