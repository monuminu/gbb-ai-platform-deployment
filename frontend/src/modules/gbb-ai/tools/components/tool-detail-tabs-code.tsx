import { useState, useCallback } from 'react';
import flashFill from '@iconify/icons-mingcute/flash-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { deployFunction } from 'src/api/tool';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import ToolDetailCopilot from './tool-detail-copilot';
import ToolDetailTabsCodeMeta from './tool-detail-tabs-code-meta';
import ToolDetailTabsCodeEditor from './tool-detail-tabs-code-editor';
import ToolDetailTabsCodeDependencies from './tool-detail-tabs-code-dependencies';

// ----------------------------------------------------------------------

const CODETYPES = ['Python', 'OpenAPI'];

// ----------------------------------------------------------------------

type Props = {
  methods?: any;
};

export default function ToolDetailCodeTab({ methods }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { watch, setValue } = methods;

  const values = watch();

  const { id, code, meta, type, entryFunction, dependencies, envVars } = values;

  const popover = usePopover();

  const [deploying, setDeploying] = useState(false);
  const [copilotTrigger, setCopilotTrigger] = useState('');

  const handleClick = (trigger: string) => {
    setCopilotTrigger(trigger);
  };

  const handleUpdateCodeType = useCallback(
    (newValue: string) => {
      popover.onClose();
      setValue('type', newValue);
    },
    // eslint-disable-next-line
    [popover]
  );

  const handleUpdateEntryFunction = (data: string | string[] | null) => {
    const funcName = typeof data === 'string' ? data : '';
    setValue('entryFunction', funcName);
  };

  const handleUpdateCode = (data: string) => {
    setValue('code', data);
  };

  const handleUpdateMeta = (data: string) => {
    setValue('meta', data);
  };

  const handleAddDependency = () => {
    setValue('dependencies', [...values.dependencies, '']);
  };

  const handleUpdateDependency = (index: number, value: string) => {
    setValue(
      'dependencies',
      values.dependencies.map((item: string, i: number) => (i === index ? value : item))
    );
  };

  const handleRemoveDependency = (index: number) => {
    setValue(
      'dependencies',
      values.dependencies.filter((_: string, i: number) => i !== index)
    );
  };

  const handleCopilotCallback = (data: string) => {
    if (copilotTrigger === 'code') {
      if (data.includes('```python')) {
        const _code = data.split('```python\n')[1].split('```\n')[0];
        setValue('code', _code);
      } else setValue('code', data);
    } else if (copilotTrigger === 'meta') {
      if (data.includes('```json')) {
        const _meta = data.split('```json\n')[1].split('```\n')[0];
        setValue('meta', _meta);
      } else setValue('meta', data);
    }
  };

  const handleDeploy = useCallback(
    async () => {
      try {
        if (code === '') {
          enqueueSnackbar('No code provided', { variant: 'error' });
          return;
        }

        if (entryFunction === '') {
          enqueueSnackbar('No entry function provided', { variant: 'error' });
          return;
        }

        const dependencieString = dependencies.join('\n');
        const envVarsObject = (envVars as { key: string; value: string }[]).reduce(
          (obj: { [key: string]: string }, item) => {
            obj[item.key] = item.value;
            return obj;
          },
          {}
        );

        setDeploying(true);
        const res = await deployFunction(id, entryFunction, code, dependencieString, envVarsObject);
        setDeploying(false);

        if (res && res.status === 200 && res.data.result.includes('successfully')) {
          enqueueSnackbar('Deployed sucessfully');
        } else if (res && res.data.result) {
          enqueueSnackbar(res.data.result, { variant: 'error' });
        }
      } catch (error) {
        setDeploying(false);
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [id, code, envVars, entryFunction, dependencies, confirm]
  );

  return (
    <Stack>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ height: 'auto', p: -1.5 }}>
              <CardHeader
                title="Editor"
                sx={{ mt: -1, mb: -0.5 }}
                action={
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ py: -1.5 }}>
                    <Button
                      size="small"
                      color="inherit"
                      variant="soft"
                      onClick={popover.onOpen}
                      endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    >
                      {type}
                    </Button>

                    {type.toLowerCase() === 'python' && (
                      <LoadingButton
                        size="small"
                        color="primary"
                        variant="contained"
                        loading={deploying}
                        onClick={handleDeploy}
                        startIcon={<Iconify icon={flashFill} />}
                      >
                        Deploy
                      </LoadingButton>
                    )}

                    <IconButton size="small" onClick={() => handleClick('code')}>
                      <Box
                        component="img"
                        src="/assets/icons/modules/ic_copilot.svg"
                        sx={{ width: 26, height: 26, cursor: 'pointer' }}
                      />
                    </IconButton>
                  </Stack>
                }
              />

              <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

              <Stack sx={{ px: 3 }} spacing={2}>
                <ToolDetailTabsCodeEditor
                  code={code}
                  codeType={type}
                  entryFunction={entryFunction}
                  updateEntryFunction={handleUpdateEntryFunction}
                  updateCode={handleUpdateCode}
                />
              </Stack>

              <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
                {CODETYPES.map((_type) => (
                  <MenuItem
                    key={_type}
                    selected={_type === type}
                    onClick={() => handleUpdateCodeType(_type)}
                  >
                    {_type}
                  </MenuItem>
                ))}
              </CustomPopover>
            </Card>

            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <Card sx={{ height: 'auto', p: -1.5 }}>
                <CardHeader
                  title="Definition"
                  sx={{ mt: -1, mb: -0.5 }}
                  action={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: -1.5 }}>
                      <IconButton size="small" onClick={() => handleClick('meta')}>
                        <Box
                          component="img"
                          src="/assets/icons/modules/ic_copilot.svg"
                          sx={{ width: 26, height: 26, cursor: 'pointer' }}
                        />
                      </IconButton>
                    </Stack>
                  }
                />

                <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

                <Stack sx={{ px: 3 }} spacing={2}>
                  <ToolDetailTabsCodeMeta meta={meta} updateMeta={handleUpdateMeta} />
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <ToolDetailTabsCodeDependencies
            dependencies={dependencies}
            onAddDependency={handleAddDependency}
            onUpdateDependency={handleUpdateDependency}
            onDeleteDependency={handleRemoveDependency}
          />
        </Grid>
      </Grid>

      <ToolDetailCopilot
        open={!!copilotTrigger}
        trigger={copilotTrigger}
        context={code}
        onClose={() => handleClick('')}
        callBack={handleCopilotCallback}
      />
    </Stack>
  );
}
