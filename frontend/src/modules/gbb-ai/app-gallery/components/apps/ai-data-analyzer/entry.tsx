import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';

import Box from '@mui/material/Box';
import { Stack, Button, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, setStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import { getConfiguration } from 'src/api/gpt';

import Label from 'src/components/label';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import { GptConfigEntry } from 'src/components/gpt-configuration';

import { MlAppStruct } from 'src/types/app';
import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components/ChatWindow';

// ----------------------------------------------------------------------

type Props = {
  mlApp: MlAppStruct;
};

export default function AiDataAnalyzer({ mlApp }: Props) {
  const settings = useSettingsContext();
  const [chatMode, setChatMode] = useState('open-chat');

  const [messages, setMessages] = useState([] as Message[]);
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

  const apiUrl = mlApp.content;

  const localConfgutrations: IConfiguration = getStorage(mlApp.id);

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  const [configurations, setConfigurations] = useState<IConfiguration>({
    ...initialConfigurations,
    ...localConfgutrations,
  });

  const handleUpdateConfigs = (_config: IConfiguration) => {
    setConfigurations(_config);
    setStorage(mlApp.id, _config);
  };

  const hanldeClearHistory = () => {
    setMessages([]);
  };

  const config = useBoolean();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
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

        {/* <Typography variant="subtitle2">{mlApp.title}</Typography> */}

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

      <Box>
        <ChatWindow
          apiUrl={apiUrl}
          messages={messages}
          onUpdateMessages={setMessages}
          configurations={configurations}
          chatMode={chatMode}
          onSetChatMode={setChatMode}
          isNavHorizontal={isNavHorizontal}
        />
      </Box>

      {/* <DataCopilotConfigDialog
        open={config.value}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
        onSelectIndex={handleSelectIndex}
      /> */}

      <GptConfigEntry
        open={config.value}
        callerId={mlApp.id}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
        tabs={[]}
      />
    </>
  );
}
