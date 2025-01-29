import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import chatIcon from '@iconify/icons-entypo/chat';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
import crowdsourceIcon from '@iconify/icons-simple-icons/crowdsource';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { Stack, Portal, Dialog, CardHeader, ClickAwayListener } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import uuidv4 from 'src/utils/uuidv4';

import { ComingSoonImage } from 'src/assets';
import { createKnowledge } from 'src/api/kmm';
import { useAuthContext } from 'src/auth/hooks';
import { getPhotoBase64Data } from 'src/api/user';

import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
// import { userCancelled } from '@azure/msal-browser/dist/error/BrowserAuthErrorCodes';

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

const modes = [
  {
    label: 'Knowledge base',
    description: `This handles multiple file formats, builds Azure AI Search indexes, and produces embeddings and chunks. It is particularly tailored for the RAG scenario.`,
  },
  {
    label: 'Question answer',
    description:
      'This supports question-answer data and allows the creation of unlimited question-answer flows. It is specifically designed for QA scenarios demanding minimal error margin.',
  },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onRefresh: () => void;
};

export default function CreateKbDialog({ open, onClose, onRefresh }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMode, setSelectedMode] = useState(modes[0].label);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const schema = Yup.object().shape({
    kbName: Yup.string().required('Knowledge base name is required'),
    indexName: Yup.string().required('Index name is required'),
    tags: Yup.array(),
  });

  const defaultValues: { kbName: string; indexName: string; tags: string[] } = {
    kbName: `knowledge-${currentTimestamp}`,
    indexName: `index-${currentTimestamp}`,
    tags: [],
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      setCurrentTimestamp(Date.now());
      reset(defaultValues);
    }
    // eslint-disable-next-line
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const photoBase64DataRes = await getPhotoBase64Data(user?.photoURL);

      const kbId = uuidv4();
      const _user = {
        id: '1',
        name: user?.displayName || 'Anonymous',
        email: user?.username || 'Anonymous',
        photo: photoBase64DataRes || '',
        permission: 'edit',
        avatarUrl: photoBase64DataRes ? '' : '/assets/avatars/avatar_1.jpg',
      };

      const payload = { ...data, kbId, tags: data.tags || [], shared: [_user] };
      const res = await createKnowledge(payload);
      if (res && res.success) {
        enqueueSnackbar('Created successfully');
        onRefresh();
        onClose();
        router.push(paths.gbbai.kb.details(kbId));
      } else if (res && !res.success) {
        enqueueSnackbar(res.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const handleSelectMode = useCallback(
    (newValue: string) => {
      if (selectedMode !== newValue) setSelectedMode(newValue);
    },
    [selectedMode]
  );

  const renderModes = modes.map((mode) => (
    <Stack
      key={mode.label}
      spacing={2.5}
      component={Paper}
      variant="outlined"
      direction="row"
      alignItems="center"
      onClick={() => handleSelectMode(mode.label)}
      sx={{
        p: 2.5,
        py: 2,
        position: 'relative',
        cursor: 'pointer',
        ...(mode.label === selectedMode && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
    >
      <Box sx={{ width: 22, height: 22 }}>
        <Icon
          icon={mode.label === 'Knowledge base' ? crowdsourceIcon : chatIcon}
          width={22}
          height={22}
        />
      </Box>
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" component="div">
          {mode.label}
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">
          {mode.description}
        </Typography>
      </Stack>
    </Stack>
  ));

  return (
    <Portal>
      <ClickAwayListener onClickAway={() => {}}>
        <Dialog open={open} onClose={onClose}>
          <RootStyle
            sx={{
              top: 0,
              left: 0,
              display: 'flex',
              margin: 'auto',
              width: { xs: '90%', md: '85%', lg: '75%' },
              height: { xs: '90vh', md: '80vh' },
              maxWidth: 1100,
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Create knowledge" sx={{ mb: 1.5 }} />

              <Scrollbar sx={{ flexDirection: 'row' }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Box sx={{ mx: 3.5, mt: 2, mb: 2 }}>
                    <Box
                      sx={{
                        gap: 3,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                      }}
                    >
                      {renderModes}
                    </Box>

                    <Divider sx={{ my: 4 }} style={{ borderStyle: 'dashed' }} />

                    {selectedMode === 'Knowledge base' && (
                      <Stack sx={{ mt: 1, mb: 3 }} spacing={3}>
                        <Box
                          sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: {
                              xs: 'repeat(1, 1fr)',
                              sm: 'repeat(2, 1fr)',
                              md: 'repeat(3, 1fr)',
                              lg: 'repeat(3, 1fr)',
                            },
                          }}
                        >
                          <RHFTextField name="kbName" label="Name" fullWidth size="medium" />
                          {selectedMode === 'Knowledge base' && (
                            <RHFTextField
                              fullWidth
                              name="indexName"
                              label="Index name"
                              size="medium"
                            />
                          )}

                          <RHFAutocomplete
                            size="medium"
                            name="tags"
                            label="Tags"
                            placeholder="+ Tags"
                            multiple
                            freeSolo
                            autoSelect
                            options={[]}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            )}
                            renderTags={(selected, getTagProps) =>
                              selected.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option}
                                  label={option}
                                  size="small"
                                  color="info"
                                  variant="soft"
                                />
                              ))
                            }
                          />
                        </Box>
                      </Stack>
                    )}

                    {selectedMode === 'Question answer' && (
                      <Stack sx={{ alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ my: 2 }}>
                          Coming soon
                        </Typography>

                        <Typography sx={{ color: 'text.secondary' }}>
                          We are currently working on this
                        </Typography>

                        <ComingSoonImage sx={{ my: 6, height: 180 }} />
                      </Stack>
                    )}
                  </Box>
                </FormProvider>
              </Scrollbar>

              <Divider />

              <DialogActions>
                <LoadingButton
                  loading={isSubmitting}
                  disabled={selectedMode === 'Question answer'}
                  type="submit"
                  variant="contained"
                  onClick={onSubmit}
                >
                  Confirm
                </LoadingButton>
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
