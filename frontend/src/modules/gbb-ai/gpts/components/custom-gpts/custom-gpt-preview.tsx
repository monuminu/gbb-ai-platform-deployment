import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import { getConfiguration } from 'src/api/gpt';

import SvgColor from 'src/components/svg-color';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import RagSourceDialog from 'src/components/rag-source-panel/rag-source-dialog';

import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components/ChatWindow';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  instruction: string;
  description: string;
  coverUrl: string;
  samplePrompts: string[];
  functionList?: string[];
  knowledgeBase?: string;
  attachments?: Record<string, string[]>;
  //
  open: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};

export default function CustomGptPreview({
  title,
  coverUrl,
  instruction,
  description,
  samplePrompts,
  functionList,
  knowledgeBase,
  attachments,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  let chatMode = 'open-chat';
  let indexName: string | undefined;

  if (functionList && functionList.length > 0) {
    chatMode = 'function-calling';
  } else if (knowledgeBase && knowledgeBase.length > 0) {
    chatMode = 'rag';
    indexName = knowledgeBase.split('<sep>')[1] || undefined;
  }
  const hasContent = title || description || instruction || coverUrl;

  const settings = useSettingsContext();
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

  // const localConfgutrations: IConfiguration = getStorage(AOAI_STORAGE_CONFIG);

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);

  const [configurations] = useState<IConfiguration>({
    ...initialConfigurations,
    [`${chatMode.toLowerCase()}-System message`]: instruction,
  });

  // console.log(configurations);

  // const handleUpdateConfigs = (config: IConfiguration) => {
  //   setConfigurations(config);
  //   setStorage(AOAI_STORAGE_CONFIG, config);
  // };

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
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: 'background.default' } }}
    >
      <DialogActions sx={{ py: 1.5, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Preview
        </Typography>

        <Button size="small" variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          size="small"
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Publish
        </LoadingButton>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'} sx={{ py: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Button
              to={paths.gbbai.appGallery.root}
              component={RouterLink}
              size="small"
              color="inherit"
              startIcon={<Icon icon={arrowIosBackFill} style={{ marginRight: '-5px' }} />}
              sx={{ display: 'flex', visibility: 'hidden' }}
            >
              Gallery
            </Button>

            <Stack direction="row" alignItems="center">
              <Tooltip title="Clear histroy">
                <IconButton
                  size="small"
                  color="default"
                  onClick={hanldeClearHistory}
                  sx={{ width: 36, height: 36 }}
                >
                  <SvgColor
                    src="/assets/icons/modules/ic-sweep.svg"
                    sx={{ width: 22, height: 22 }}
                  />
                </IconButton>
              </Tooltip>
              {/* <IconButton
                size="small"
                color="default"
                onClick={config.onTrue}
                sx={{ width: 36, height: 36 }}
              >
                <SvgColor src="/static/icons/apps/ic_settings.svg" sx={{ width: 20, height: 20 }} />
              </IconButton> */}
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
              sampleAttachments={attachments}
              onOpenRagSourcePopover={handleOpenRagSourcePopover}
            />
          </Box>

          <RagSourceDialog
            open={openRagThoughts.value}
            onClose={openRagThoughts.onFalse}
            ragThoughts={ragThoughts}
            selectedSource={selectedRagSource}
          />
        </Container>
      ) : (
        <EmptyContent filled title="Empty Content!" />
      )}
    </Dialog>
  );
}
