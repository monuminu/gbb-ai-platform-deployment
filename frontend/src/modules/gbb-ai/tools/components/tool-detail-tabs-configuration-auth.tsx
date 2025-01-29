// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// project import
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  apiAuth: { type: string; apiKey: string; authType: string } | null;
  onUpdateApiAuth: (type: string, content: string) => void;
};

export default function ToolDetailConfigurationTabAuth({ apiAuth, onUpdateApiAuth }: Props) {
  const secret = useBoolean();

  return (
    <Card>
      <CardHeader title="Authentication" sx={{ mt: -1, mb: -0.5 }} />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5, mb: 1.75 }} />

      <Box flex={1} sx={{ px: 3, py: 0.5, position: 'relative' }}>
        <Typography variant="overline" color="text.secondary">
          Type
        </Typography>
      </Box>

      <Stack
        spacing={1.25}
        direction="row"
        alignItems="center"
        sx={{ px: 3, py: 0.5, mb: 2, position: 'relative' }}
      >
        {['None', 'API Key'].map((_type) => (
          <Stack
            key={_type}
            spacing={1}
            direction="row"
            component={Paper}
            variant="outlined"
            alignItems="center"
            onClick={() => onUpdateApiAuth('type', _type)}
            sx={{ px: 2, py: 0.75, borderRadius: 0.75, cursor: 'pointer' }}
          >
            <Radio
              size="small"
              sx={{ p: 0.25, width: 16, height: 16 }}
              checked={apiAuth ? _type === apiAuth.type : _type === 'Basic'}
              onClick={() => onUpdateApiAuth('type', _type)}
            />
            <Stack sx={{ typography: 'subtitle2' }}>{_type}</Stack>
          </Stack>
        ))}
      </Stack>

      {apiAuth?.type === 'API Key' && (
        <Stack spacing={1.25}>
          <Stack spacing={1.25} sx={{ pl: 1, ml: 2, mr: 3, mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary">
              API Key
            </Typography>
            <TextField
              size="small"
              value={apiAuth?.apiKey || ''}
              type={secret.value ? 'text' : 'password'}
              sx={{ mr: 1, width: '100%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={secret.onToggle} size="small" edge="end">
                      <Iconify
                        width={16}
                        icon={secret.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => onUpdateApiAuth('apiKey', event.target.value)}
            />
          </Stack>

          <Stack spacing={1.25} sx={{ pl: 1, ml: 2, mr: 3, mb: 3 }}>
            <Typography variant="overline" color="text.secondary">
              Auth type
            </Typography>
            <Stack spacing={1.25} direction="row" alignItems="center">
              {['Basic', 'Bearer'].map((_authType) => (
                <Stack
                  key={_authType}
                  spacing={1}
                  direction="row"
                  component={Paper}
                  variant="outlined"
                  alignItems="center"
                  onClick={() => onUpdateApiAuth('authType', _authType)}
                  sx={{ px: 2, py: 0.75, borderRadius: 0.75, cursor: 'pointer' }}
                >
                  <Radio
                    size="small"
                    sx={{ p: 0.25, width: 16, height: 16 }}
                    checked={apiAuth ? _authType === apiAuth.authType : _authType === 'Basic'}
                    onClick={() => onUpdateApiAuth('authType', _authType)}
                  />
                  <Stack sx={{ typography: 'subtitle2' }}>{_authType}</Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}
