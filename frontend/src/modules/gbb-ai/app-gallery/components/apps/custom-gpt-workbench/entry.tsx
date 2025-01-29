import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, setStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import { getConfiguration } from 'src/api/gpt';

import Label from 'src/components/label';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import RagSourceDialog from 'src/components/rag-source-panel/rag-source-dialog';

import { ICustomGpt } from 'src/types/app';
import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components-workbench/ChatWindow';
import DataCopilotConfigDialog from './components-workbench/config-panel/data-copilot-config-dialog';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  customGpts: ICustomGpt[];
  clickSource?: string;
};

export default function CustomGptsWorkbench({ id, customGpts, clickSource }: Props) {
  const settings = useSettingsContext();

  const config = useBoolean();
  const openRagThoughts = useBoolean();

  const [ragThoughts, setRagThoughts] = useState<any>();
  const [chatMode, setChatMode] = useState('open-chat');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [messages, setMessages] = useState([] as Message[]);
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);
  const [currentGpt, setCurrentGpt] = useState<ICustomGpt | null>(null);
  const [selectedRagSource, setSelectedRagSource] = useState<string>('All');

  const aoaiCredentials: IAoaiResourceItem[] = getStorage(AOAI_CREDENTIAL_KEY);

  const aoaiResourceNames = aoaiCredentials ? aoaiCredentials.map((item) => item.resourceName) : [];
  const primaryResources = aoaiCredentials ? aoaiCredentials.filter((item) => item.primary) : [];
  const primaryResourceName =
    primaryResources && primaryResources.length > 0 ? primaryResources[0].resourceName : '';
  let intialResourceName = '';
  if (primaryResourceName.length > 0) {
    intialResourceName = primaryResourceName;
  } else if (aoaiResourceNames && aoaiResourceNames.length > 0) {
    intialResourceName = aoaiResourceNames[0];
  }

  const localConfgutrations: IConfiguration = getStorage(id);

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  const [configurations, setConfigurations] = useState<IConfiguration>({
    ...initialConfigurations,
    ...localConfgutrations,
  });

  // console.log(currentGpt);
  // console.log(chatMode);
  // console.log(currentGpt?.knowledgeBase);
  // console.log(configurations);
  useEffect(() => {
    if (currentGpt) {
      if (currentGpt.functionList && currentGpt.functionList.length > 0) {
        setChatMode('function-calling');
        setSelectedIndex('');
        setConfigurations((prevConfigurations) => ({
          ...prevConfigurations,
          ...(currentGpt && {
            'function-calling-System message': currentGpt.instruction,
          }),
        }));
        setSelectedToolNames(currentGpt.functionList);
      } else if (currentGpt.knowledgeBase && currentGpt.knowledgeBase.length > 0) {
        setChatMode('rag');
        setSelectedToolNames([]);
        setConfigurations((prevConfigurations) => ({
          ...prevConfigurations,
          ...(currentGpt && {
            'rag-System message': currentGpt.instruction,
          }),
        }));
        setSelectedIndex(currentGpt.knowledgeBase.split('<sep>')[1]);
      } else {
        setChatMode('open-chat');
        setSelectedIndex('');
        setSelectedToolNames([]);
        setConfigurations((prevConfigurations) => ({
          ...prevConfigurations,
          ...(currentGpt && {
            'open-chat-System message': currentGpt.instruction,
          }),
        }));
      }
    } else {
      setChatMode('open-chat');
      setSelectedIndex('');
      setConfigurations((prevConfigurations) => ({
        ...prevConfigurations,
        'open-chat-System message':
          initialConfigurations[`${chatMode.toLowerCase()}-System message`],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGpt]);

  const handleUpdateConfigs = (_config: IConfiguration) => {
    setConfigurations(_config);
    setStorage(id, _config);
  };

  const hanldeClearHistory = () => {
    setMessages([]);
  };

  const handleOpenRagSourcePopover = useCallback(
    (thoughts: any, selected: string) => {
      setRagThoughts(thoughts);
      setSelectedRagSource(selected);
      openRagThoughts.onTrue();
    },
    [openRagThoughts]
  );

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Button
          to={clickSource === 'gpts' ? paths.gbbai.gpts.root : paths.gbbai.appGallery.root}
          component={RouterLink}
          size="small"
          color="inherit"
          startIcon={<Icon icon={arrowIosBackFill} style={{ marginRight: '-5px' }} />}
          sx={{ display: 'flex' }}
        >
          Back
          {/* {clickSource === 'gpts' ? 'GPT store' : 'Back'} */}
        </Button>

        <Stack direction="row" alignItems="center">
          <Label color="default" sx={{ textTransform: 'None', mr: 1.5 }}>
            {configurations[`${chatMode}-Deployment`] || 'No GPT deployment'}
          </Label>
          <Tooltip title="Clear histroy">
            <IconButton
              size="small"
              color="default"
              onClick={hanldeClearHistory}
              sx={{ width: 36, height: 36 }}
            >
              <SvgColor src="/assets/icons/modules/ic-sweep.svg" sx={{ width: 22, height: 22 }} />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            color="default"
            onClick={config.onTrue}
            sx={{ width: 36, height: 36 }}
          >
            <SvgColor src="/static/icons/apps/ic_settings.svg" sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Box
        sx={{
          height: isNavHorizontal ? 'calc(100vh - 328px)' : 'calc(100vh - 204px)',
          display: 'flex',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <ChatWindow
          chatMode={chatMode}
          customGpts={customGpts}
          messages={messages}
          currentGpt={currentGpt}
          setCurrentGpt={setCurrentGpt}
          onUpdateMessages={setMessages}
          configurations={configurations}
          selectedIndex={selectedIndex}
          selectedToolNames={selectedToolNames}
          onOpenRagSourcePopover={handleOpenRagSourcePopover}
        />
      </Box>

      <DataCopilotConfigDialog
        open={config.value}
        chatMode={chatMode}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
      />

      <RagSourceDialog
        open={openRagThoughts.value}
        onClose={openRagThoughts.onFalse}
        ragThoughts={ragThoughts}
        selectedSource={selectedRagSource}
      />
    </>
  );
}
