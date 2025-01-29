import AceEditor from 'react-ace';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import roundSend from '@iconify/icons-ic/round-send';

// mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

// project import
import { makeApiCall } from 'src/api/tool';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  params: { name: string; type: string; value: string }[];
  apiAuth: { type: string; apiKey: string; authType: string } | null;
  onUpdateParams: (index: number, data: string) => void;
  onSetLoadingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateResponse: (data: string) => void;
};

export default function TesterRequestOpenAPI({
  params,
  apiAuth,
  onUpdateParams,
  onSetLoadingResponse,
  onUpdateResponse,
}: Props) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { enqueueSnackbar } = useSnackbar();
  const [executing, setExecuting] = useState(false);

  const url = params.find((param) => param.name === 'url')?.value || '';
  const method = params.find((param) => param.name === 'method')?.value || '';
  const requestBody = params.find((param) => param.name === 'requestBody')?.value || '';
  const filteredParams = params.filter(
    (param) => !['url', 'method', 'path', 'requestBody'].includes(param.name)
  );

  const sendRequest = useCallback(
    async () => {
      try {
        if (url === '') {
          enqueueSnackbar('No API url provided', { variant: 'error' });
          return;
        }

        setExecuting(true);
        onSetLoadingResponse(true);

        const apiKey = apiAuth?.apiKey || '';
        const apiParams = filteredParams.reduce<Record<string, string>>((acc, param) => {
          acc[param.name] = param.value;
          return acc;
        }, {});

        const resData = await makeApiCall({
          url,
          method,
          apiKey,
          apiParams,
          data: requestBody,
        });

        setExecuting(false);
        onSetLoadingResponse(false);

        if (resData) {
          onUpdateResponse(JSON.stringify(resData));
        } else {
          enqueueSnackbar('No data', { variant: 'error' });
        }
      } catch (error) {
        setExecuting(false);
        onSetLoadingResponse(false);
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [url, method, filteredParams]
  );

  return (
    <Box sx={{ height: '100%' }}>
      {url && method && (
        <Paper
          sx={{
            mx: 3,
            mb: 3,
            p: '0px 4px',
            display: 'flex',
            alignItems: 'center',
            border: `solid 1px ${theme.palette.divider}`,
            backgroundColor: `${theme.palette.background.default}`,
          }}
        >
          <Box sx={{ pb: 0.25, ml: 1 }}>
            <Typography variant="overline" color="text.secondary" textTransform="uppercase">
              {method}
            </Typography>
          </Box>

          <Divider sx={{ height: 30, m: 0.5, ml: 1.5, mr: 1.5 }} orientation="vertical" />

          <InputBase
            sx={{ flex: 1, fontSize: '14px', typography: 'body2', color: 'text.secondary' }}
            defaultValue={url}
          />
        </Paper>
      )}

      {requestBody && (
        <Stack sx={{ mx: 3 }} spacing={1.5}>
          <Typography variant="overline" color="text.secondary">
            Body
          </Typography>
          <Box
            sx={{
              py: 1,
              mb: 3,
              minHeight: 200,
              maxHeight: 'calc(100vh - 512px)',
              height: 5 * 20.75,
              borderRadius: 1,
              border: `solid 1px ${theme.palette.divider}`,
              backgroundColor: `${theme.palette.background.paper}`,
            }}
          >
            <AceEditor
              mode="json"
              value={requestBody}
              theme={isLight ? 'textmate' : 'tomorrow_night_bright'}
              onChange={(newValue) => onUpdateParams(3, newValue)}
              fontSize={13}
              editorProps={{ $blockScrolling: true }}
              showPrintMargin={false}
              height="100%"
              width="100%"
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showGutter: true,
                highlightActiveLine: false,
                wrap: true, // Enable text wrapping
              }}
              style={{
                fontFamily: "'Fira Code', monospace",
                lineHeight: 1.5,
                backgroundColor: `${theme.palette.background.paper}`,
              }}
            />
          </Box>
        </Stack>
      )}

      {filteredParams.length > 0 && (
        <Stack sx={{ mx: 3 }} spacing={1.5}>
          <Typography variant="overline" color="text.secondary">
            Parameters
          </Typography>
          <Stack sx={{ flexGrow: 1 }} spacing={1}>
            <Scrollbar>
              <Box
                sx={{
                  py: 0.5,
                  gap: 3,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                }}
              >
                {filteredParams.map((item, index) => {
                  const { name, value } = item;
                  return (
                    <TextField
                      key={index}
                      fullWidth
                      size="small"
                      label={method === 'get' ? name : ''}
                      value={value}
                      onChange={(event) => onUpdateParams(index + 3, event.target.value)}
                    />
                  );
                })}
              </Box>
            </Scrollbar>
          </Stack>
        </Stack>
      )}
      {params.length === 0 && (
        <EmptyContent
          title="No parameters found"
          width="100%"
          sx={{ height: { xs: '70vh', md: '45vh' } }}
        />
      )}
      <Stack sx={{ position: 'absolute', bottom: 0, right: 0, width: '100%' }}>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <DialogActions sx={{ py: 2.5, pr: 3 }}>
          <LoadingButton
            size="small"
            disabled={url === ''}
            variant="contained"
            sx={{ px: 1.25 }}
            loading={executing}
            startIcon={<Icon icon={roundSend} />}
            onClick={sendRequest}
          >
            Send
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Box>
  );
}
