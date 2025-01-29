import { useState } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import translate2 from '@iconify/icons-ri/translate-2';
import codeLine from '@iconify/icons-mingcute/code-line';
import twotoneTaskAlt from '@iconify/icons-ic/twotone-task-alt';
import functionIcon from '@iconify/icons-material-symbols/function';
import writingFluently from '@iconify/icons-icon-park-outline/writing-fluently';
import summarizeOutline from '@iconify/icons-material-symbols/summarize-outline';
import sentimentVerySatisfied from '@iconify/icons-mdi/sentiment-very-satisfied';
import documentTextExtract24Regular from '@iconify/icons-fluent/document-text-extract-24-regular';

import { Tab, Tabs, List, Stack, Divider, Typography, ListSubheader } from '@mui/material';

import { varFade } from 'src/components/animate';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';

import ChatPromptItem from './ChatPromptItem';
import { promptSamples } from './demo/prompt-samples';

// ----------------------------------------------------------------------

type Props = {
  openPopover: HTMLElement | null;
  setOpenPopover: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatPromptPopover({ openPopover, setOpenPopover, setMessage }: Props) {
  const [currentTab, setCurrentTab] = useState('code');

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const PROMPT_CATEGORIES = [
    {
      label: 'coding',
      value: 'code',
      icon: <Icon icon={codeLine} width={20} height={20} />,
    },
    {
      label: 'translate',
      value: 'translate',
      icon: <Icon icon={translate2} width={20} height={20} />,
    },
    {
      label: 'entity extraction',
      value: 'entityExtraction',
      icon: <Icon icon={documentTextExtract24Regular} width={20} height={20} />,
    },
    {
      label: 'Text summary',
      value: 'textSummary',
      icon: <Icon icon={summarizeOutline} width={20} height={20} />,
    },
    {
      label: 'sentiment analysis',
      value: 'sentiment',
      icon: <Icon icon={sentimentVerySatisfied} width={20} height={20} />,
    },
    {
      label: 'task execution',
      value: 'task',
      icon: <Icon icon={twotoneTaskAlt} width={20} height={20} />,
    },
    {
      label: 'text generation',
      value: 'textGeneration',
      icon: <Icon icon={writingFluently} width={20} height={20} />,
    },
    {
      label: 'function calling',
      value: 'functionCalling',
      icon: <Icon icon={functionIcon} width={20} height={20} />,
    },
  ];

  const listSubhearder = PROMPT_CATEGORIES.filter((category) => category.value === currentTab)[0]
    .label;

  return (
    <CustomPopover
      open={openPopover}
      onClose={handleClosePopover}
      arrow="bottom-center"
      sx={{ width: 360 }}
      hiddenArrow
    >
      <Typography variant="subtitle1" sx={{ py: 1, pb: 1.5, px: 1 }}>
        Prompt library
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack>
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => {
            setCurrentTab(value);
          }}
          sx={{
            my: 1,
            mx: 1,
            justifyContent: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {PROMPT_CATEGORIES.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              value={tab.value}
              style={{ marginRight: 12, minWidth: 30, maxWidth: 48 }}
              icon={tab.icon}
            />
          ))}
        </Tabs>
      </Stack>

      <Scrollbar sx={{ mt: 1, height: { xs: 300, sm: 380 } }}>
        <List
          disablePadding
          subheader={
            <ListSubheader disableSticky sx={{ py: 0.5, px: 1, typography: 'overline' }}>
              {listSubhearder}
            </ListSubheader>
          }
        >
          <m.div variants={varFade().inUp}>
            {promptSamples[currentTab].map((promptSample: any, index: number) => (
              <ChatPromptItem
                key={index}
                selected={false}
                onSelectQuery={setMessage}
                title={promptSample.title}
                prompt={promptSample.prompt}
              />
            ))}
          </m.div>
        </List>
      </Scrollbar>
    </CustomPopover>
  );
}
