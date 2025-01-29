import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import starsOutline from '@iconify/icons-mdi/stars-outline';
import chatIcon from '@iconify/icons-material-symbols/chat';
import functionIcon from '@iconify/icons-material-symbols/function';
import twotoneContentPasteSearch from '@iconify/icons-ic/twotone-content-paste-search';

import { Button, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import CustomPopover from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  chatMode: string;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatMessageInputModeBtn({ chatMode, onSetChatMode }: Props) {
  const ref = useRef(null);
  const [showBtnText, setShowBtnText] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
    setShowBtnText(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setShowBtnText(false);
  };

  return (
    <>
      <Button
        ref={ref}
        variant="contained"
        onClick={handleOpenPopover}
        onMouseEnter={() => setShowBtnText(true)}
        onMouseLeave={() => openPopover === null && setShowBtnText(false)}
        startIcon={<Icon icon={starsOutline} />}
        sx={{
          width: showBtnText ? 'auto' : '36px',
          maxWidth: showBtnText ? 'auto' : '36px',
          minWidth: showBtnText ? 'auto' : '36px',
          height: '36px',
          padding: 1,
          paddingRight: showBtnText ? 2.3 : 1,
          borderRadius: 18,
          color: 'white',
          whiteSpace: 'nowrap',
          mr: 1,
          '& .MuiButton-startIcon': { mx: showBtnText ? 1 : 0 },
        }}
      >
        {showBtnText ? chatMode : ''}
      </Button>

      <CustomPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="bottom-center"
        sx={{ width: 176 }}
        hiddenArrow
      >
        <MenuItem
          sx={{ color: 'text.secondary', mb: 0.5 }}
          onClick={() => onSetChatMode('open-chat')}
        >
          <ListItemIcon sx={{ width: 20, mr: 0 }}>
            <Icon icon={chatIcon} width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="Open-chat" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary', mb: 0.5 }} onClick={() => onSetChatMode('rag')}>
          <ListItemIcon sx={{ width: 20, mr: 0 }}>
            <Icon icon={twotoneContentPasteSearch} width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="RAG" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => onSetChatMode('function-calling')}
        >
          <ListItemIcon sx={{ width: 20, mr: 0 }}>
            <Icon icon={functionIcon} width={22} height={22} />
          </ListItemIcon>
          <ListItemText primary="Function-calling" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {/* </Menu> */}
      </CustomPopover>
    </>
  );
}
