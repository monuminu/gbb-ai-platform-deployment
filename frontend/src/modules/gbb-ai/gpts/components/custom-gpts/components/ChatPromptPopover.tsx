import { m } from 'framer-motion';

import { Divider, Typography } from '@mui/material';

import { varFade } from 'src/components/animate';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';

import ChatPromptItem from './ChatPromptItem';

// ----------------------------------------------------------------------

type Props = {
  samplePrompts: string[];
  openPopover: HTMLElement | null;
  setOpenPopover: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatPromptPopover({
  samplePrompts,
  openPopover,
  setOpenPopover,
  setMessage,
}: Props) {
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

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
