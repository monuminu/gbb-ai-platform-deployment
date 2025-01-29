import { useRef, useState, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import {
  Stack,
  Portal,
  Dialog,
  Button,
  Divider,
  CardHeader,
  DialogActions,
  ClickAwayListener,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { IConfiguration } from 'src/types/chat';

import KbTab from './tab-kb';
import ChatTab from './tab-chat';
import ToolTab from './tab-tools';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  flexDirection: 'row',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  callerId: string;
  onClose: VoidFunction;
  configurations: IConfiguration;
  onUpdate: (config: IConfiguration) => void;
  selectedIndex?: string;
  onSelectIndex?: (index: string) => void;
  selectedTools?: string[];
  onSelectTools?: (tools: string[]) => void;
  tabs?: string[];
};

export default function GptConfigEntry({
  open,
  callerId,
  onClose,
  configurations,
  onUpdate,
  selectedIndex,
  onSelectIndex,
  selectedTools,
  onSelectTools,
  tabs = ['open-chat', 'rag', 'function-calling'],
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedMode, setSelectedMode] = useState(tabs && tabs.length > 0 ? tabs[0] : 'open-chat');

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
    onClose();
  };

  const handleChangeMode = useCallback((newMode: string) => {
    setSelectedMode(newMode);
  }, []);

  return (
    <Portal>
      <ClickAwayListener onClickAway={() => {}}>
        <Dialog open={open} onClose={onClose}>
          <RootStyle
            sx={{
              ...{
                top: 0,
                left: 0,
                display: 'flex',
                margin: 'auto',
                width: { xs: '90%', md: '85%', lg: '75%' },
                height: { xs: '90vh', md: '80vh' },
                maxWidth: 1100,
              },
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Configuration" sx={{ mb: 1.5 }} />

              <Scrollbar sx={{ flexDirection: 'row' }}>
                <ChatTab
                  onClose={() => {}}
                  configs={configurations}
                  ref={formRef}
                  onUpdate={onUpdate}
                  modes={tabs}
                  selectedMode={selectedMode}
                  onChangeMode={handleChangeMode}
                />

                {selectedMode === 'function-calling' && onSelectTools && (
                  <ToolTab selectedTools={selectedTools} onSelectTools={onSelectTools} />
                )}

                {selectedMode === 'rag' && onSelectIndex && (
                  <KbTab onSelectIndex={onSelectIndex} selectedIndex={selectedIndex} />
                )}
              </Scrollbar>

              <Divider />

              <DialogActions>
                <Button type="submit" variant="contained" onClick={handleButtonClick}>
                  Confirm
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Stack>
          </RootStyle>
        </Dialog>
      </ClickAwayListener>
    </Portal>
  );
}
