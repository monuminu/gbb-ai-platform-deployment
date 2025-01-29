/* eslint-disable */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';
import isJsonString from 'src/utils/json-string';

import { getFileSas, useFetchApps, uploadCustomGpt } from 'src/api/app-gallery';

import Iconify from 'src/components/iconify';
import { CustomFile } from 'src/components/upload';
import FormProvider from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ICustomGpt } from 'src/types/app';

import CustomGptPreview from '../custom-gpts/custom-gpt-preview';
import CustomGptNewEditChatBench from '../custom-gpts/custom-gpt-chat-bench';
import CustomGptNewEditConfiguration from '../custom-gpts/custom-gpt-configuration';

// ----------------------------------------------------------------------

type Props = {
  id?: string;
};

export default function CustomeGptCreateEditView({ id }: Props) {
  const preview = useBoolean();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const initialRenderRef = useRef(true);
  const [attachments, setAttachments] = useState<Record<string, (File | string)[]>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { apps } = useFetchApps();

  const router = useRouter();

  const currentApp = id ? apps.find((_app) => _app.id === id) : null;

  const currentGpt: ICustomGpt = id
    ? {
        ...(currentApp && JSON.parse(currentApp.content)),
        coverUrl: currentApp?.cover,
        category: currentApp?.category,
      }
    : null;

  // const currentGpt: ICustomGpt = id
  //   ? useMemo(
  //       () => ({
  //         ...(currentApp && JSON.parse(currentApp.content)),
  //         coverUrl: currentApp?.cover,
  //         category: currentApp?.category,
  //       }),
  //       [currentApp]
  //     )
  //   : null;

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const NewGptSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    instruction: Yup.string().required('System prompt is required'),
    category: Yup.string().required('Category is required'),
    content: Yup.string(),
    coverUrl: Yup.mixed<any>().nullable().required('Cover is required'),
    coverType: Yup.string(),
    status: Yup.string(),
    // not required
    tags: Yup.array().min(0),
    function: Yup.boolean(),
    functionList: Yup.mixed().test(
      'functionList',
      'Must have at least one item when Function is turned on.',
      (value: any, { parent }) => {
        const { function: functionValue } = parent;
        if (functionValue && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
    assistant: Yup.boolean(),
    assistantName: Yup.mixed().test(
      'assistantName',
      'Must have at least one item when Assistant is turned on.',
      (value: any, { parent }) => {
        const { assistant: assistantValue } = parent;
        if (assistantValue && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
    knowledge: Yup.boolean(),
    knowledgeBase: Yup.mixed().test(
      'knowledgeBase',
      'Must have at least one item when Knowledge is turned on.',
      (value: any, { parent }) => {
        const { knowledge: knowledgeValue } = parent;
        if (knowledgeValue && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),

    samplePrompts: Yup.array().min(0),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentGpt?.id || uuidv4(),
      name: currentGpt?.name || '',
      description: currentGpt?.description || '',
      instruction: currentGpt?.instruction || '',
      content: '',
      coverUrl: currentGpt?.coverUrl || null,
      tags: currentGpt?.tags || ([] as string[]),
      status: currentGpt?.status || 'draft',
      coverType: 'custom',
      category: currentGpt?.category || '',
      function: currentGpt?.function || false,
      functionList: currentGpt?.functionList || ([] as string[]),
      knowledge: currentGpt?.knowledge || false,
      knowledgeBase: currentGpt?.knowledgeBase || '',
      assistant: currentGpt?.assistant || false,
      assistantName: currentGpt?.assistantName || '',
      samplePrompts: currentGpt?.samplePrompts || [],
    }),
    [currentGpt]
  );

  const methods = useForm({
    resolver: yupResolver(NewGptSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const values = watch();

  const handleSamplePrompts = useCallback(async (_samplePrompts: string[] | undefined) => {
    if (!_samplePrompts) return [];

    const reformedPrompts: string[] = [];

    _samplePrompts.forEach(async (_prompt, index) => {
      if (isJsonString(_prompt)) {
        const parsedPrompt = JSON.parse(_prompt);
        if ('content' in parsedPrompt) {
          reformedPrompts.push(parsedPrompt.content);
        }
        if ('attachments' in parsedPrompt) {
          const reformedAttachmentsPromises = parsedPrompt.attachments.map(
            async (file: File | string) => {
              if (typeof file !== 'string' || file.startsWith('https://')) {
                return file;
              }
              const res = await getFileSas(file);
              return res;
            }
          );

          const reformedAttachments = await Promise.all(reformedAttachmentsPromises);

          setAttachments((prev: any) => ({
            ...prev,
            [`prompt-${index}`]: reformedAttachments,
          }));
        }
      } else {
        reformedPrompts.push(_prompt);
      }
    });

    return reformedPrompts;
  }, []);

  const handleUpdateAttachments = useCallback(
    (acceptedFiles: (File | string)[], promptOrder: number, mode: 'add' | 'remove') => {
      if (!acceptedFiles) return;

      setAttachments((prevFiles) => {
        const existingFiles = prevFiles ? prevFiles[`prompt-${promptOrder}`] || [] : [];

        return {
          ...prevFiles,
          [`prompt-${promptOrder}`]:
            mode === 'add'
              ? [...existingFiles, ...acceptedFiles]
              : existingFiles.filter((file) => file !== acceptedFiles[0]),
        };
      });
    },
    []
  );

  useEffect(() => {
    if (currentApp && initialRenderRef.current) {
      initialRenderRef.current = false;
      // console.log(currentApp);
      const fetchData = async () => {
        reset(defaultValues);
        const _samplePrompts = await handleSamplePrompts(currentGpt.samplePrompts);
        setValue('samplePrompts', _samplePrompts);
      };
      fetchData();
    }
  }, [reset, setValue, currentApp, currentGpt, defaultValues, handleSamplePrompts]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      let cover = '';

      // console.log('data.coverUrl:', data.coverUrl);
      if (typeof data.coverUrl !== 'string') {
        formData.append('file', data.coverUrl);
        cover = `${data.id}.${data.coverUrl.name.split('.').pop() || 'jpg'}`;
      } else if (currentApp) {
        const fileSuffix = currentApp.cover.split('?')[0].split('.').pop();
        cover = `${data.id}.${fileSuffix}`;
      }

      if (attachments) {
        // console.log('attachments:', attachments);
        Object.entries(attachments).forEach(([key, value]) => {
          value.forEach((file, _index) => {
            if (typeof file !== 'string') {
              formData.append(`${key}-${_index}`, file);
            }
          });
        });
      }

      // Reform sample prompts
      const _samplePrompts = data.samplePrompts.map((prompt: string, _index: number) => {
        if (attachments && Object.keys(attachments).includes(`prompt-${_index}`)) {
          const promptObj = {
            content: prompt,
            attachments: attachments[`prompt-${_index}`].map((file) => {
              if (typeof file !== 'string') {
                const subStr = uuidv4().substring(0, 6);
                formData.append(`prompt-${_index}-${subStr}`, file);
                return `${data.id}-prompt-${_index}-${subStr}.${
                  file.name.split('.').pop() || 'jpg'
                }`;
              }
              const originalFile = file.split('?')[0].split('/').pop();
              return originalFile;
            }),
          };
          return JSON.stringify(promptObj);
        }
        return prompt;
      });

      // console.log(_samplePrompts);

      const customGptData = { ...data, samplePrompts: _samplePrompts };
      // console.log(customGptData);
      delete customGptData.coverUrl;

      const appData = currentApp
        ? {
            ...currentApp,
            content: JSON.stringify(customGptData),
            cover,
            category: data.category,
            status: data.status,
            dateModified: new Date(),
            scenarios: data.tags.map((tag: string) => ({ color: 'primary', title: tag })),
            title: data.name,
          }
        : {
            id: data.id,
            category: data.category,
            content: JSON.stringify(customGptData),
            source: 'custom',
            status: data.status,
            cover: `${data.id}.${data.coverUrl.name.split('.').pop() || 'jpg'}`,
            dateCreated: new Date(),
            dateModified: new Date(),
            maintainers: [
              {
                avatar: '/assets/avatars/avatar_1.jpg',
                email: 'admin@gbb_ai.com',
                name: 'Lei',
                permission: 'view',
              },
            ],
            scenarios: data.tags.map((tag: string) => ({ color: 'primary', title: tag })),
            title: data.name,
            type: 'Text',
          };

      const jsonData = JSON.stringify(appData);
      formData.append('appData', jsonData);

      // console.log('formData:', formData.keys());

      await uploadCustomGpt(formData)
        .then((res) => {
          if (res && res.success) {
            enqueueSnackbar(res.message, { variant: 'success' });
            router.push(paths.gbbai.gpts.edit(appData.id));
          } else {
            enqueueSnackbar(res.message, { variant: 'error' });
          }
        })
        .catch((error) => {
          enqueueSnackbar(error, { variant: 'error' });
          console.error('An error occurred while uploading the custom GPT:', error);
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  });

  const componentHeight = isNavHorizontal ? 'calc(100vh - 336px)' : 'calc(100vh - 230px)';

  const attachmentsAsStringArray = attachments
    ? Object.entries(attachments)
        .map(([key, value]) => [
          key,
          value.map((item) =>
            typeof item === 'string' ? item : `${(item as CustomFile)?.preview}`
          ),
        ])
        .reduce((acc, [key, value]) => ({ ...acc, [key as string]: value }), {})
    : {};

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading={currentGpt ? 'Edit' : 'Create custom GPT'}
          links={[
            {
              name: 'List',
              href: paths.gbbai.gpts.root,
            },
            {
              name: currentGpt ? currentGpt.name : 'New GPT',
            },
          ]}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        size="small"
                        checked={field.value === 'published'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'published' : 'draft')
                        }
                      />
                    )}
                  />
                }
                label="Publish"
              />
              <Button size="small" color="inherit" variant="outlined" onClick={preview.onTrue}>
                Preview
              </Button>

              <LoadingButton
                size="small"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon={cloudUploadFill} />}
                onClick={onSubmit}
              >
                Upload
              </LoadingButton>
            </Stack>
          }
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          <Grid xs={12} md={6} sx={{ width: '100%', height: componentHeight }}>
            <CustomGptNewEditConfiguration
              methods={methods}
              attachments={attachments}
              onUpdateAttachments={handleUpdateAttachments}
            />
          </Grid>

          <Grid xs={12} md={6} sx={{ width: '100%', height: componentHeight }}>
            <CustomGptNewEditChatBench
              key={JSON.stringify(values)}
              avatarUrl={
                typeof values.coverUrl === 'string'
                  ? values.coverUrl
                  : `${(values.coverUrl as CustomFile)?.preview}`
              }
              instruction={values.instruction}
              functionList={values.functionList as string[]}
              knowledgeBase={values.knowledgeBase ? (values.knowledgeBase as string) : ''}
            />
          </Grid>
        </Grid>

        <CustomGptPreview
          key={JSON.stringify(values)}
          title={values.name}
          instruction={values.instruction || ''}
          description={values.description}
          coverUrl={
            typeof values.coverUrl === 'string'
              ? values.coverUrl
              : `${(values.coverUrl as CustomFile)?.preview}`
          }
          samplePrompts={values.samplePrompts || []}
          functionList={values.functionList as string[]}
          knowledgeBase={values.knowledgeBase ? (values.knowledgeBase as string) : ''}
          attachments={attachmentsAsStringArray}
          //
          open={preview.value}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onClose={preview.onFalse}
          onSubmit={onSubmit}
        />
      </FormProvider>
    </Container>
  );
}
