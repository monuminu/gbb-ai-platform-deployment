import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Conversation } from 'src/types/chat';

import ChatMessageItem from './ChatMessageItem';
import ChatWelcomeTitle from './ChatWelcomeTitle';
import ChatPromptExampleCard from './ChatPromptExampleCard';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
// const regex2 = /\!\[.*?\]\((.*?)\)/g;
const regex2 = /!\[.*?\]\((.*?)\)/g;

type ChatMessageListProps = {
  gptName: string;
  avatarUrl: string;
  description: string;
  samplePrompts: string[];
  conversation: Conversation;
  onSend: Function;
  attachments?: Record<string, string[]>;
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatMessageList({
  gptName,
  avatarUrl,
  description,
  samplePrompts,
  conversation,
  onSend,
  attachments,
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
  // console.log(images);attachments?: { type: string; url: string }[]; url: file.preview

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ py: 2, px: 1.25, height: 1 }}>
        <Box sx={{ mx: 2, mb: 8, mt: 0 }}>
          <Avatar alt="copilot" src={avatarUrl} sx={{ width: 52, height: 52, mx: 'auto', mt: 4 }} />

          <ChatWelcomeTitle title={gptName} />

          <Typography
            variant="body1"
            sx={{
              mb: 2,
              mt: 0,
              mx: { xs: 1, md: 5 },
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {description}
          </Typography>

          {samplePrompts.length > 0 && (
            <Typography variant="body2" sx={{ mb: 2, mt: 8, textAlign: 'center' }}>
              Try following prompts
            </Typography>
          )}

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
            {samplePrompts.map((prompt, index) => (
              <ChatPromptExampleCard
                key={index}
                title={`${index}`}
                content={prompt}
                onSend={onSend}
                attachments={attachments}
              />
            ))}
          </Box>
        </Box>

        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            avatarUrl={avatarUrl}
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
