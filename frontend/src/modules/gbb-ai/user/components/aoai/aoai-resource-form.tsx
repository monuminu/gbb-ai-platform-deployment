import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IAoaiResourceItem } from 'src/types/azure-resource';

// ----------------------------------------------------------------------

const MODEL_OPTIONS = [
  'gpt-35-turbo',
  'gpt-35-turbo-16k',
  'gpt-35-turbo-instruct',
  'gpt-4',
  'gpt-4o',
  'gpt-4-32k',
  'text-embedding-ada-002',
  'text-embedding-3-large',
  'text-embedding-3-small',
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate?: (resource: IAoaiResourceItem) => void;
  onUpdate?: (oldName: string, resource: IAoaiResourceItem) => void;
  onDelete?: (oldName: string) => void;
  resource?: IAoaiResourceItem;
};

export default function AoaiResourceForm({
  open,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  resource,
}: Props) {
  const apiKey = useBoolean();

  const NewAoaiResourceSchema = Yup.object().shape({
    resourceName: Yup.string().required('Resource name is required'),
    endpoint: Yup.string().required('Endpoint is required'),
    deployment: Yup.string().required('Deployment name is required'),
    model: Yup.string().required('GPT Model is required'),
    key: Yup.string().required('Key is required'),
    apiVersion: Yup.string().required('Country is required'),
  });

  const defaultValues = useMemo(
    () => ({
      resourceName: resource ? resource.resourceName : '',
      endpoint: resource ? resource.endpoint : '',
      deployment: resource ? resource.deployment : '',
      model: resource ? resource.model : '',
      key: resource ? resource.key : '',
      apiVersion: resource ? resource.apiVersion : '2023-07-01-preview',
    }),
    [resource]
  );

  const methods = useForm({
    resolver: yupResolver(NewAoaiResourceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (onCreate)
        onCreate({
          resourceName: data.resourceName,
          endpoint: data.endpoint,
          deployment: data.deployment,
          model: data.model,
          key: data.key,
          apiVersion: data.apiVersion,
          primary: resource ? resource.primary : false,
        });

      if (onUpdate)
        onUpdate(resource ? resource.resourceName : '', {
          resourceName: data.resourceName,
          endpoint: data.endpoint,
          deployment: data.deployment,
          model: data.model,
          key: data.key,
          apiVersion: data.apiVersion,
          primary: resource ? resource.primary : false,
        });

      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* <DialogTitle> {resource ? 'Edit resource' : 'New resource'} </DialogTitle> */}

        <CardHeader
          title={resource ? 'Edit resource' : 'New resource'}
          sx={{ mb: 3 }}
          action={
            resource && (
              <IconButton
                color="error"
                onClick={() => {
                  if (onDelete) {
                    onDelete(resource?.resourceName || '');
                    onClose();
                  }
                }}
              >
                <Iconify icon="gravity-ui:trash-bin" width={18} />
              </IconButton>
            )
          }
        />

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <RHFTextField
              name="resourceName"
              label="Resource name"
              placeholder="the name of your GPT deployment"
            />
            <RHFTextField
              name="endpoint"
              label="Endpoint"
              placeholder="https://xxx.openai.azure.com/"
            />

            <RHFTextField
              name="deployment"
              label="Deployment"
              placeholder="the name of your GPT deployment"
            />
            {/* <RHFTextField name="model" label="Model" placeholder="gpt-35-turbo, gpt-4, e.g." /> */}
            <RHFAutocomplete
              name="model"
              label="Model"
              placeholder="Select a model"
              options={MODEL_OPTIONS.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} />
                ))
              }
            />

            <RHFTextField
              name="key"
              label="Key"
              type={apiKey.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={apiKey.onToggle} edge="end">
                      <Iconify icon={apiKey.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="apiVersion"
              label="API version"
              placeholder="2023-07-01-preview, e.g."
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
