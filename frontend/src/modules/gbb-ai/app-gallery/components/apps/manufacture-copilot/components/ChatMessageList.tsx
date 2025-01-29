import { Box, Typography } from '@mui/material';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Conversation } from 'src/types/chat';

import ChatMessageItem from './ChatMessageItem';
import ChatWelcomeTitle from './ChatWelcomeTitle';
import ChatPromptExampleCard from './ChatPromptExampleCard';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'jpeg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
const regex2 = /!\[.*?\]\((.*?)\)/g;

const ragSamples = [
  {
    title: 'Sample 1',
    content: 'What is the length and width of FDP6031S Power Clip?',
  },
  {
    title: 'Sample 2',
    content: 'Who is the manufacturer of FDP6031S Power Clip?',
  },
  {
    title: 'Sample 3',
    content: 'What are Q2 features of FDP6031S Power Clip?',
  },
  {
    title: 'Sample 4',
    content: 'What are MOSFET max ratings?',
  },
  {
    title: 'Sample 5',
    content: 'What are on region characteristics of Q1-N-Channel?',
  },
  {
    title: 'Sample 6',
    content: 'What is the thickness of FDP6031S Power Clip?',
  },
];

type ChatMessageListProps = {
  conversation: Conversation;
  chatMode: string;
  onSend: Function;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
  onOpenRagSourcePopover: (thoughts: any, selected: string) => void;
};

export default function ChatMessageList({
  conversation,
  chatMode,
  onSend,
  onSetChatMode,
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

  // console.log(conversation.messages);
  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ py: 2, px: 1, height: 1 }}>
        <Box sx={{ mx: 2, mb: 8, mt: 0 }}>
          <ChatWelcomeTitle title="Manufacturing Copilot" />

          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              mt: 0,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            Try following prompts
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
            {ragSamples.map((card: any) => (
              <ChatPromptExampleCard
                key={card.title}
                title={card.title}
                content={card.content}
                icon={card.icon}
                chatMode={chatMode}
                onSend={onSend}
              />
            ))}
          </Box>
        </Box>

        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            isLastMessage={index === conversation.messages.length - 1}
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
