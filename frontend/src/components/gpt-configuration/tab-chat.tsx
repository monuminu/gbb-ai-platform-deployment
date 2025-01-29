import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import chatIcon from '@iconify/icons-material-symbols/chat';
import functionIcon from '@iconify/icons-material-symbols/function';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import twotoneContentPasteSearch from '@iconify/icons-ic/twotone-content-paste-search';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

// ----------------------------------------------------------------------

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 30,
  borderRadius: 8,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
  padding: theme.spacing(2.5, 1),
  paddingLeft: theme.spacing(1),
  justifyContent: 'flex-start',
  color: theme.palette.text.secondary,
}));

const retrievalModes = ['hybrid', 'text', 'vectors'];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  configs: IConfiguration;
  onUpdate: (config: IConfiguration) => void;
  modes: string[];
  selectedMode: string;
  onChangeMode: (newMode: string) => void;
};

const OpenChatTab = forwardRef(
  ({ onClose, configs, onUpdate, modes, selectedMode, onChangeMode }: Props, ref) => {
    const aoaiCredentials: IAoaiResourceItem[] = getStorage(AOAI_CREDENTIAL_KEY);

    const aoaiResourceNames = aoaiCredentials
      ? aoaiCredentials.map((item) => item.resourceName)
      : [];

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

    const handleSelectMode = useCallback(
      (newValue: string) => {
        if (selectedMode !== newValue) onChangeMode(newValue);
      },
      [selectedMode, onChangeMode]
    );

    const renderModes = modes.map((mode) => (
      <Stack
        key={mode}
        spacing={2}
        component={Paper}
        variant="outlined"
        direction="row"
        alignItems="center"
        onClick={() => handleSelectMode(mode)}
        sx={{
          p: 2,
          py: 1.5,
          position: 'relative',
          cursor: 'pointer',
          ...(mode === selectedMode && {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
          }),
        }}
      >
        <Box sx={{ width: 20, height: 20 }}>
          <Icon icon={getIcon(mode)} width={20} height={20} />
        </Box>
        <Stack sx={{ typography: 'subtitle1' }}>
          {mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase().replace('-', ' ')}
        </Stack>
      </Stack>
    ));

    return (
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ m: 1.25, mt: -1, mb: 2 }}>
          <CollapseButtonStyle
            disableRipple
            color="inherit"
            onClick={aoaiConfig.onToggle}
            startIcon={
              <Icon
                icon={aoaiConfig.value ? arrowIosDownwardFill : arrowIosForwardFill}
                width={16}
                height={16}
              />
            }
            sx={{ width: '94%', '&:hover': { backgroundColor: 'transparent' } }}
          >
            Azure OpenAI
          </CollapseButtonStyle>

          {aoaiConfig.value && (
            <>
              {modes.length > 0 && (
                <Box
                  sx={{
                    mx: 4.5,
                    mt: 1,
                    mb: 3,
                    gap: 3,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                  }}
                >
                  {renderModes}
                </Box>
              )}

              {modes.length > 0 && (
                <Divider sx={{ mx: 4.5, my: 3 }} style={{ borderStyle: 'dashed' }} />
              )}

              <Stack sx={{ mx: 4.5, mt: 1, mb: 3 }} spacing={3}>
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
                    .filter((param) => param.startsWith(selectedMode))
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
                                <li {...props} key={`${selectedMode}-${resourceName}`}>
                                  {primary && (
                                    <Iconify
                                      key={`${selectedMode}-${resourceName}`}
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
                            label={item.replace(`${selectedMode}-`, '')}
                            options={retrievalModes}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => {
                              const mode = retrievalModes.filter(
                                (_item: string) => _item === option
                              )[0];

                              if (!mode) return null;

                              return (
                                <li {...props} key={`${selectedMode}-${mode}`}>
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
                            label={item.replace(`${selectedMode}-`, '')}
                          />
                        );
                      }
                      return (
                        <RHFTextField
                          key={item}
                          name={item}
                          label={item.replace(`${selectedMode}-`, '')}
                          fullWidth
                          size="small"
                        />
                      );
                    })}
                </Box>
                {selectedMode === 'open-chat' && (
                  <RHFTextField
                    multiline
                    fullWidth
                    size="small"
                    maxRows={5}
                    name="open-chat-System message"
                    label="System message"
                  />
                )}
                {selectedMode === 'rag' && (
                  <RHFTextField
                    multiline
                    fullWidth
                    size="small"
                    maxRows={5}
                    name="rag-System message"
                    label="System message"
                  />
                )}
                {selectedMode === 'function-calling' && (
                  <RHFTextField
                    multiline
                    fullWidth
                    size="small"
                    maxRows={5}
                    name="function-calling-System message"
                    label="System message"
                  />
                )}
              </Stack>
            </>
          )}
          {!aoaiConfig.value && <Divider sx={{ mx: 2 }} />}
        </Box>
      </FormProvider>
    );
  }
);

export default OpenChatTab;

// ----------------------------------------------------------------------

function getIcon(mode: string) {
  if (mode === 'open-chat') {
    return chatIcon;
  }
  if (mode === 'rag') {
    return twotoneContentPasteSearch;
  }
  return functionIcon;
}
