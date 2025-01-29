import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';

import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, setStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import { getConfiguration } from 'src/api/gpt';

import Label from 'src/components/label';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import { GptConfigEntry } from 'src/components/gpt-configuration';
import RagSourceDialog from 'src/components/rag-source-panel/rag-source-dialog';

import { MlAppStruct } from 'src/types/app';
import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components/ChatWindow';

// ----------------------------------------------------------------------

type Props = {
  mlApp: MlAppStruct;
};

export default function ManufacturingCopilot({ mlApp }: Props) {
  const settings = useSettingsContext();

  const config = useBoolean();
  const openRagThoughts = useBoolean();

  const [ragThoughts, setRagThoughts] = useState<any>();
  const [chatMode, setChatMode] = useState('rag');
  const [messages, setMessages] = useState([] as Message[]);
  const [selectedRagSource, setSelectedRagSource] = useState<string>('All');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

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

  const localConfgutrations: IConfiguration = getStorage(mlApp.id);

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  const [configurations, setConfigurations] = useState<IConfiguration>({
    ...initialConfigurations,
    ...localConfgutrations,
  });

  const [selectedIndex] = useState(mlApp.content || '');
  const [selectedTools, setSelectedTools] = useState(configurations.selectedTools || []);

  // const [selectedFuncs, setSelectedFuncs] = useState([
  //   'func_1',
  //   'func_2',
  //   'func_3',
  //   'func_4',
  //   'func_5',
  //   'func_6',
  //   'func_7',
  // ]);

  const handleUpdateConfigs = (_config: IConfiguration) => {
    setConfigurations(_config);
    setStorage(mlApp.id, _config);
  };

  const handleSelectIndex = (index: string) => {
    // setSelectedIndex(index);
    // setConfigurations({ ...configurations, selectedIndex: index });
    // setStorage(mlApp.id, { ...configurations, selectedIndex: index });
  };

  const handleSelectTools = (tools: string[]) => {
    setSelectedTools(tools);
    setConfigurations({ ...configurations, selectedTools: tools });
    setStorage(mlApp.id, { ...configurations, selectedTools: tools });
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

  // console.log(ragThoughts);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Button
          to={paths.gbbai.appGallery.root}
          component={RouterLink}
          size="small"
          color="inherit"
          startIcon={<Icon icon={arrowIosBackFill} style={{ marginRight: '-5px' }} />}
          sx={{ display: 'flex' }}
        >
          Back
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
          messages={messages}
          onUpdateMessages={setMessages}
          configurations={configurations}
          selectedIndex={selectedIndex}
          chatMode={chatMode}
          onSetChatMode={setChatMode}
          onOpenRagSourcePopover={handleOpenRagSourcePopover}
          onSelectIndex={handleSelectIndex}
          selectedTools={selectedTools}
          onSelectTools={handleSelectTools}
        />
      </Box>

      <GptConfigEntry
        open={config.value}
        callerId={mlApp.id}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
        selectedTools={selectedTools}
        onSelectTools={handleSelectTools}
        tabs={['rag']}
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
