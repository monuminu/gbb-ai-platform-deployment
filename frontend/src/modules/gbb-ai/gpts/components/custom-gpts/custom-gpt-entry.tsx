import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import AppTag from 'src/components/custom-tags/AppTag';
import { useSettingsContext } from 'src/components/settings';
// import { GptConfigEntry } from 'src/components/gpt-configuration';
import RagSourceDialog from 'src/components/rag-source-panel/rag-source-dialog';

import { ICustomGpt } from 'src/types/app';
import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components/ChatWindow';
import DataCopilotConfigDialog from './components/config-panel/data-copilot-config-dialog';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  gptContent: string;
  coverUrl: string;
};

export default function CustomGptEntry({ title, coverUrl, gptContent }: Props) {
  const customGpt: ICustomGpt = {
    ...(gptContent && JSON.parse(gptContent)),
    coverUrl,
  };

  const { id, status, description, instruction, functionList, knowledgeBase, samplePrompts } =
    customGpt;

  let chatMode = 'open-chat';
  let indexName: string | undefined;
  if (functionList && functionList.length > 0) {
    chatMode = 'function-calling';
  } else if (knowledgeBase && knowledgeBase.length > 0) {
    chatMode = 'rag';
    indexName = knowledgeBase.split('<sep>')[1] || undefined;
  }

  const settings = useSettingsContext();

  const config = useBoolean();
  const openRagThoughts = useBoolean();

  const [ragThoughts, setRagThoughts] = useState<any>();
  const [messages, setMessages] = useState([] as Message[]);
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
    [`${chatMode.toLowerCase()}-System message`]: instruction,
  });

  // console.log(configurations);

  // const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  // const [configurations, setConfigurations] = useState<IConfiguration>({
  //   ...initialConfigurations,
  // });

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
          to={paths.gbbai.gpts.root}
          component={RouterLink}
          size="small"
          color="inherit"
          startIcon={<Icon icon={arrowIosBackFill} style={{ marginRight: '-5px' }} />}
          sx={{ display: 'flex' }}
        >
          GPT store
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
          {status === 'draft' && (
            <AppTag
              title="Draft"
              color="info"
              sx={{ ml: 1.5, height: 24, textTransform: 'none', borderRadius: 0.75 }}
            />
          )}
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
          gptName={title}
          chatMode={chatMode}
          avatarUrl={coverUrl}
          description={description}
          samplePrompts={samplePrompts}
          messages={messages}
          onUpdateMessages={setMessages}
          configurations={configurations}
          selectedIndex={indexName}
          functionList={functionList}
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

      {/* <GptConfigEntry
        open={config.value}
        callerId={id}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
        tabs={[]}
      /> */}

      <RagSourceDialog
        open={openRagThoughts.value}
        onClose={openRagThoughts.onFalse}
        ragThoughts={ragThoughts}
        selectedSource={selectedRagSource}
      />
    </>
  );
}
