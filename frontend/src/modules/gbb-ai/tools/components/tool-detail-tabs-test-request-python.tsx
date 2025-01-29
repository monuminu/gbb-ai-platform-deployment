import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import roundSend from '@iconify/icons-ic/round-send';

// mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

// project import
import { escapeSpecialCharacters } from 'src/utils/string-processor';

import { testFunction } from 'src/api/tool';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  entryFunction: string;
  params: { name: string; type: string; value: string }[];
  onUpdateParams: (index: number, data: string) => void;
  onSetLoadingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateResponse: (data: string) => void;
};

export default function TesterRequestPython({
  entryFunction,
  params,
  onUpdateParams,
  onSetLoadingResponse,
  onUpdateResponse,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [executing, setExecuting] = useState(false);

  const sendRequest = useCallback(
    async () => {
      try {
        if (entryFunction === '') {
          enqueueSnackbar('No function provided', { variant: 'error' });
          return;
        }

        const command = `${entryFunction}(${params
          .filter(
            (param) => param.value !== undefined && param.value !== null && param.value !== ''
          )
          .map((param) => `${param.name}='${escapeSpecialCharacters(param.value)}'`)
          .join(', ')})`;

        // const convertedCmd = escapeSpecialCharacters(command);
        // console.log(command);
        // console.log(convertedCmd);
        // console.log(escapeSpecialCharacters(command));

        setExecuting(true);
        onSetLoadingResponse(true);
        const res = await testFunction(command);
        setExecuting(false);
        onSetLoadingResponse(false);

        if (res && res.status === 200) {
          if (Object.prototype.hasOwnProperty.call(res.data, 'result')) {
            const { result } = res.data;
            let modifiedResult = result;
            if (result.startsWith("'") && result.endsWith("'")) {
              modifiedResult = result.slice(1, -1);
            }

            const convertedString = unicodeToChar(modifiedResult);

            onUpdateResponse(convertedString);
            // onUpdateResponse(JSON.stringify(res.data));
          }
        } else if (res && res.data.result) {
          enqueueSnackbar(res.data.result, { variant: 'error' });
        }
      } catch (error) {
        setExecuting(false);
        onSetLoadingResponse(false);
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [entryFunction, params]
  );

  return (
    <Box sx={{ height: '100%' }}>
      {params.length > 0 && (
        <Stack sx={{ flexGrow: 1 }} spacing={1.5}>
          <Scrollbar>
            <Box
              sx={{
                px: 3,
                py: 0.5,
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              {params.map((item, index) => {
                const { name, value } = item;
                return (
                  <TextField
                    key={index}
                    fullWidth
                    multiline
                    size="small"
                    label={name}
                    value={value}
                    onChange={(event) => onUpdateParams(index, event.target.value)}
                  />
                );
              })}
            </Box>
          </Scrollbar>
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
            disabled={entryFunction === ''}
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

// ----------------------------------------------------------------------

function unicodeToChar(text: string): string {
  return text
    .replace(/\\\\u/g, '\\u')
    .replace(/\\u[\dA-F]{4}/gi, (match) =>
      String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    );
}
