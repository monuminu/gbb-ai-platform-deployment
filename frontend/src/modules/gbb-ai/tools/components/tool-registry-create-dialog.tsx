import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Portal from '@mui/material/Portal';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import uuidv4 from 'src/utils/uuidv4';
import { fData } from 'src/utils/format-number';

import { uploadTool } from 'src/api/tool';
import { useAuthContext } from 'src/auth/hooks';
import { getPhotoBase64Data } from 'src/api/user';

import Scrollbar from 'src/components/scrollbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFUploadAvatar,
} from 'src/components/hook-form';
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

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function CreateToolDialog({ open, onClose }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [isCreating, setIsCreating] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const schema = Yup.object().shape({
    name: Yup.string().required('Tool name is required'),
    description: Yup.string(),
    tags: Yup.array(),
    cover: Yup.mixed<any>().nullable(),
  });

  const defaultValues = {
    name: `Tool-${currentTimestamp}`,
    description: '',
    tags: [],
    cover: null,
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

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

      const toolId = uuidv4();
      const _user = {
        id: '1',
        name: user?.displayName || 'Anonymous',
        email: user?.username || 'Anonymous',
        photo: photoBase64DataRes || '',
        permission: 'edit',
        avatarUrl: photoBase64DataRes ? '' : '/assets/avatars/avatar_1.jpg',
      };

      setIsCreating(true);
      const formData = new FormData();
      let _cover = '';

      if (data.cover && typeof data.cover !== 'string') {
        formData.append('file', data.cover);
        _cover = `${toolId}.${data.cover.name.split('.').pop() || 'jpg'}`;
      }

      const toolData = {
        ...data,
        id: toolId,
        cover: _cover,
        type: 'Python',
        status: 'draft',
        shared: [_user],
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      const jsonData = JSON.stringify(toolData);
      formData.append('toolData', jsonData);

      await uploadTool(formData)
        .then((res) => {
          if (res && res.success) {
            enqueueSnackbar('Tool created', { variant: 'success' });
            onClose();
            router.push(paths.gbbai.function.details(toolId));
          } else {
            enqueueSnackbar(res.message, { variant: 'error' });
          }
        })
        .catch((error) => {
          enqueueSnackbar(error, { variant: 'error' });
          console.error('An error occurred while uploading the tool:', error);
        });

      setIsCreating(false);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('cover', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

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
              width: { xs: '90%', md: '55%', lg: '45%' },
              height: { xs: '90vh', md: '80vh' },
              maxWidth: 600,
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Create tool" sx={{ mb: 1.5 }} />

              <Scrollbar sx={{ flexDirection: 'row' }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Box sx={{ mx: 3, mt: 2, mb: 2 }}>
                    <Stack sx={{ mt: 1, mb: 3 }} spacing={3}>
                      <Box
                        sx={{
                          display: 'grid',
                          gap: 3,
                          gridTemplateColumns: 'repeat(1, 1fr)',
                        }}
                      >
                        <RHFUploadAvatar
                          rectangular
                          name="cover"
                          maxSize={3245728}
                          onDrop={handleDrop}
                          sx={{ width: 52, height: 52, borderRadius: 1 }}
                          helperText={
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 2,
                                mb: 0.5,
                                mx: 'auto',
                                display: 'block',
                                textAlign: 'center',
                                color: 'text.disabled',
                              }}
                            >
                              Upload tool icon (optional)
                              <br /> Allowed *.jpeg, *.jpg, *.png (max size of {fData(3245728)})
                            </Typography>
                          }
                        />

                        <RHFTextField name="name" label="Name (required)" fullWidth size="medium" />

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

                        <RHFTextField name="description" label="Description" multiline rows={3} />
                      </Box>
                    </Stack>
                  </Box>
                </FormProvider>
              </Scrollbar>

              <Divider />

              <DialogActions>
                <LoadingButton
                  loading={isCreating}
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
