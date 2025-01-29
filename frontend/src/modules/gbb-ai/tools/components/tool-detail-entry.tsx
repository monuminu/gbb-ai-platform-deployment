import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';

// mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

// project import
import { paths } from 'src/routes/paths';

import uuidv4 from 'src/utils/uuidv4';

import { uploadTool } from 'src/api/tool';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ITool } from 'src/types/tool';

import ToolDetailTabs from './tool-detail-tabs';
import ToolDetailTopTable from './tool-detail-top-table';

// ----------------------------------------------------------------------

type Props = {
  currentTool: ITool;
  onRefresh: () => void;
};

export default function ToolDetailEntry({ currentTool, onRefresh }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    cover: Yup.mixed<any>().nullable(),
    entryFunction: Yup.string(),
    code: Yup.string(),
    meta: Yup.string(),
    dependencies: Yup.array().min(0),
    description: Yup.string(),
    params: Yup.array().min(0),
    response: Yup.string(),
    type: Yup.string(),
    tags: Yup.array().min(0),
    status: Yup.string(),
    shared: Yup.array().min(0),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentTool?.id || uuidv4(),
      name: currentTool?.name || '',
      cover: currentTool?.cover || null,
      entryFunction: currentTool?.entryFunction || '',
      code: currentTool?.code || '',
      meta: currentTool?.meta || '',
      dependencies: currentTool?.dependencies || [],
      envVars: currentTool?.envVars || [],
      apiAuth: currentTool?.apiAuth || null,
      description: currentTool?.description || '',
      params: currentTool?.params || [],
      response: currentTool?.response || '',
      type: currentTool?.type || '',
      tags: currentTool?.tags || [],
      status: currentTool?.status || '',
      shared: currentTool?.shared || [],
    }),
    [currentTool]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (currentTool) {
      reset(defaultValues);
    }
  }, [currentTool, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      let _cover = '';

      // console.log(data);

      if (data.cover && typeof data.cover !== 'string') {
        formData.append('file', data.cover);
        _cover = `${data.id}.${data.cover.name.split('.').pop() || 'jpg'}`;
      } else if (
        data.cover &&
        typeof data.cover === 'string' &&
        data.cover.startsWith('/static/mock-images/')
      ) {
        _cover = data.cover;
      } else if (currentTool) {
        const fileSuffix = currentTool.cover.split('?')[0].split('.').pop();
        _cover = `${data.id}.${fileSuffix}`;
      }

      // console.log(_samplePrompts);
      // const toolData = { ...data };
      // console.log(customGptData);
      // delete toolData.cover;

      const toolData = currentTool
        ? {
            ...currentTool,
            ...data,
            cover: _cover === '' ? currentTool.cover : _cover,
            modifiedAt: new Date(),
          }
        : {
            ...data,
            cover: `${data.id}.${data.cover.name.split('.').pop() || 'jpg'}`,
            createdAt: new Date(),
            modifiedAt: new Date(),
            maintainers: [
              {
                avatarUrl: '/assets/avatars/avatar_1.jpg',
                email: 'admin@gbb_ai.com',
                name: 'Lei',
                permission: 'view',
              },
            ],
          };

      const jsonData = JSON.stringify(toolData);
      formData.append('toolData', jsonData);

      await uploadTool(formData)
        .then((res) => {
          if (res && res.success) {
            enqueueSnackbar(res.message, { variant: 'success' });
          } else {
            enqueueSnackbar(res.message, { variant: 'error' });
          }
        })
        .catch((error) => {
          enqueueSnackbar(error, { variant: 'error' });
          console.error('An error occurred while uploading the tool:', error);
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{currentTool.name}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="small"
            onClick={onRefresh}
            sx={{ width: 30, height: 30, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
          <LoadingButton
            size="small"
            variant="contained"
            loading={isSubmitting}
            startIcon={<Icon icon={cloudUploadFill} />}
            onClick={onSubmit}
          >
            Update
          </LoadingButton>
        </Stack>
      </Stack>
      <CustomBreadcrumbs
        links={[
          {
            name: 'Tools',
            href: paths.gbbai.function.root,
          },
          { name: currentTool.name },
        ]}
        sx={{ mb: { xs: 2, md: 3 }, mt: { xs: -1.5, md: -2 } }}
      />

      <ToolDetailTopTable currentTool={currentTool} methods={methods} />

      <ToolDetailTabs methods={methods} />
    </FormProvider>
  );
}
