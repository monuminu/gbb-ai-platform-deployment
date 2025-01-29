import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  envVars: { key: string; value: string }[];
  onAddEnvVar: () => void;
  onDeleteEnvVar: (index: number) => void;
  onUpdateEnvVar: (index: number, type: string, content: string) => void;
};

export default function ToolDetailConfigurationTabEnv({
  envVars,
  onAddEnvVar,
  onDeleteEnvVar,
  onUpdateEnvVar,
}: Props) {
  const [secrets, setSecrets] = useState<boolean[]>(new Array(envVars.length).fill(false));

  useEffect(() => {
    setSecrets(new Array(envVars.length).fill(false));
  }, [envVars]);

  const toggleSecret = (index: number) => {
    setSecrets((_secrets) => _secrets.map((secret, i) => (i === index ? !secret : secret)));
  };

  return (
    <Card>
      <CardHeader
        title={`Environment variables (${envVars?.length || 0})`}
        sx={{ mt: -1, mb: -0.5 }}
        action={
          <IconButton
            size="small"
            onClick={onAddEnvVar}
            sx={{ width: 30, height: 30, mt: 0.5, color: 'inherit' }}
          >
            <Iconify icon={plusFill} />
          </IconButton>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5, mb: 1.75 }} />

      {!envVars ||
        (envVars.length === 0 && (
          <EmptyContent filled title="No Environment variables" sx={{ py: 4, m: 3 }} />
        ))}

      {envVars && envVars.length > 0 && (
        <>
          <Stack
            spacing={1.25}
            direction="row"
            alignItems="center"
            sx={{ pl: 1, ml: 2, mr: 6.75, mb: 1.5 }}
            justifyContent="space-between"
          >
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                key
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                Value
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {envVars &&
              envVars.map((envVar, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  sx={{ pl: 1, mx: 2 }}
                  justifyContent="space-between"
                >
                  <TextField
                    size="small"
                    value={envVar.key || ''}
                    sx={{ mr: 1.5, width: '100%' }}
                    onChange={(event) => onUpdateEnvVar(index, 'key', event.target.value)}
                  />

                  <TextField
                    size="small"
                    value={envVar.value || ''}
                    type={secrets[index] ? 'text' : 'password'}
                    sx={{ mr: 1, width: '100%' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleSecret(index)} size="small" edge="end">
                            <Iconify
                              width={16}
                              icon={secrets[index] ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => onUpdateEnvVar(index, 'value', event.target.value)}
                  />

                  <IconButton size="small" sx={{ p: 0.9 }} onClick={() => onDeleteEnvVar(index)}>
                    <Iconify icon={closeFill} width={16} />
                  </IconButton>
                </Stack>
              ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
