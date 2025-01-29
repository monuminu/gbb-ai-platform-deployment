// import { useState } from 'react';
import { m } from 'framer-motion';
// import { Icon } from '@iconify/react';
// import translate2 from '@iconify/icons-ri/translate-2';
// import codeLine from '@iconify/icons-mingcute/code-line';
// import twotoneTaskAlt from '@iconify/icons-ic/twotone-task-alt';
// import functionIcon from '@iconify/icons-material-symbols/function';
// import writingFluently from '@iconify/icons-icon-park-outline/writing-fluently';
// import summarizeOutline from '@iconify/icons-material-symbols/summarize-outline';
// import sentimentVerySatisfied from '@iconify/icons-mdi/sentiment-very-satisfied';
// import documentTextExtract24Regular from '@iconify/icons-fluent/document-text-extract-24-regular';

import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// import { Tab, Tabs, List, Stack, Divider, Typography, ListSubheader } from '@mui/material';

import { varFade } from 'src/components/animate';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';

import ChatPromptItem from './ChatPromptItem';

// ----------------------------------------------------------------------

type Props = {
  openPopover: HTMLElement | null;
  samplePrompts: string[];
  setOpenPopover: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatPromptPopover({
  openPopover,
  samplePrompts,
  setOpenPopover,
  setMessage,
}: Props) {
  const theme = useTheme();

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <CustomPopover
      open={openPopover}
      onClose={handleClosePopover}
      arrow="bottom-center"
      sx={{ width: 360, boxShadow: theme.customShadows.z8 }}
      hiddenArrow
      style={{ transform: 'translateY(-18px)' }}
    >
      <Typography variant="subtitle1" sx={{ py: 1, pb: 1.5, px: 1 }}>
        Prompt library
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar sx={{ mt: 1, height: { xs: 300, sm: 380 } }}>
        <m.div variants={varFade().inUp}>
          {samplePrompts.map((promptSample, index) => (
            <ChatPromptItem
              key={index}
              selected={false}
              onSelectQuery={setMessage}
              title={promptSample}
              prompt={promptSample}
            />
          ))}
        </m.div>
      </Scrollbar>
    </CustomPopover>
  );
}
