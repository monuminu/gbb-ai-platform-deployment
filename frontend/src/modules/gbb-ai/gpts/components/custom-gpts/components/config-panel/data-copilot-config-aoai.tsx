import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forwardRef, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

// ----------------------------------------------------------------------

const retrievalModes = ['hybrid', 'text', 'vectors'];

// ----------------------------------------------------------------------

type Props = {
  chatMode: string;
  onClose: VoidFunction;
  configs: IConfiguration;
  onUpdate: (config: IConfiguration) => void;
};

const DataCopilotConfigAOAI = forwardRef(({ chatMode, onClose, configs, onUpdate }: Props, ref) => {
  // const { user } = useAuth();
  const aoaiCredentials: IAoaiResourceItem[] = getStorage(AOAI_CREDENTIAL_KEY);

  const aoaiResourceNames = aoaiCredentials ? aoaiCredentials.map((item) => item.resourceName) : [];

  const aoaiConfig = useBoolean(true);

  const AoaiSchema = Yup.object().shape({
    'open-chat-Deployment': Yup.string().required('AOAI deployment is required'),
    'rag-Deployment': Yup.string().required('AOAI deployment is required'),
    'function-calling-Deployment': Yup.string().required('AOAI deployment is required'),
  });

  const defaultValues: IConfiguration = configs;

  const aoaiParamList = Object.keys(defaultValues);

  const methods = useForm({
    resolver: yupResolver(AoaiSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onUpdate(data as IConfiguration);
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  useImperativeHandle(ref, () => ({
    submit: () => onSubmit(),
  }));

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ m: 1.25, mt: 1, mb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ ml: 2, mb: 4, color: 'text.disabled' }}>
            Azure OpenAI
          </Typography>
        </Box>

        {aoaiConfig.value && (
          <Stack sx={{ mx: 2, mt: 1, mb: 3 }} spacing={3}>
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
              {aoaiParamList
                .filter((param) => param.startsWith(chatMode))
                .map((item) => {
                  if (item.includes('System message')) return null;
                  if (item.includes('Deployment')) {
                    return (
                      <RHFAutocomplete
                        key={item}
                        size="small"
                        name={item}
                        label="Deployment"
                        options={aoaiResourceNames.map((name) => name)}
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => {
                          const { resourceName, primary } = aoaiCredentials.filter(
                            (_item: IAoaiResourceItem) => _item.resourceName === option
                          )[0];

                          if (!resourceName) return null;

                          return (
                            <li {...props} key={`${chatMode}-${resourceName}`}>
                              {primary && (
                                <Iconify
                                  key={`${chatMode}-${resourceName}`}
                                  icon="eva:star-fill"
                                  width={16}
                                  sx={{ mr: 1 }}
                                  color="gray"
                                />
                              )}
                              {resourceName}
                            </li>
                          );
                        }}
                      />
                    );
                  }
                  if (item.includes('Retrieval mode')) {
                    return (
                      <RHFAutocomplete
                        key={item}
                        size="small"
                        name={item}
                        label={item.replace(`${chatMode}-`, '')}
                        options={retrievalModes}
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => {
                          const mode = retrievalModes.filter(
                            (_item: string) => _item === option
                          )[0];

                          if (!mode) return null;

                          return (
                            <li {...props} key={`${chatMode}-${mode}`}>
                              {mode}
                            </li>
                          );
                        }}
                      />
                    );
                  }
                  if (item.includes('Should stream') || item.includes('Use semantic')) {
                    return (
                      <RHFCheckbox
                        key={item}
                        name={item}
                        label={item.replace(`${chatMode}-`, '')}
                      />
                    );
                  }
                  return (
                    <RHFTextField
                      key={item}
                      name={item}
                      label={item.replace(`${chatMode}-`, '')}
                      fullWidth
                      size="small"
                    />
                  );
                })}
            </Box>
          </Stack>
        )}
        {!aoaiConfig.value && <Divider sx={{ mx: 2 }} />}
      </Box>
    </FormProvider>
  );
});

export default DataCopilotConfigAOAI;
