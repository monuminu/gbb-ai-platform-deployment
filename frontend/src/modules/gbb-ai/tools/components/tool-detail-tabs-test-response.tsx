// import AceEditor from 'react-ace';
import ReactJson from 'react-json-view';
// import 'ace-builds/src-noconflict/mode-python';
// import 'ace-builds/src-noconflict/theme-github';
// import 'ace-builds/src-noconflict/theme-textmate';
// import 'ace-builds/src-noconflict/ext-language_tools';
// import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// project import
import { useBoolean } from 'src/hooks/use-boolean';

import isJsonString from 'src/utils/json-string';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import { LoadingDisplay } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  loadingResponse: boolean;
  response: any;
};

export default function TesterResponse({ loadingResponse, response }: Props) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const expand = useBoolean();

  const isJsonStr = isJsonString(response);
  // console.log(isJsonStr);
  // console.log(response);
  // console.log(isJsonObject(response));

  const resultPanel = (
    <Box>
      {loadingResponse && (
        <Box>
          <LoadingDisplay
            sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              position: 'absolute',
            }}
          />
        </Box>
      )}
      {!loadingResponse && !response && (
        <Box sx={{ height: '100%' }}>
          <EmptyContent title="No data" width="100%" sx={{ height: { xs: '70vh', md: '40vh' } }} />
        </Box>
      )}
      {!loadingResponse && response && isJsonStr && (
        <Box
          sx={{
            p: 1,
            mx: expand.value ? 0 : 3,
            borderRadius: 1,
            height: {
              xs: 120,
              md: expand.value ? 'calc(100vh - 202px)' : 'calc(100vh - 482px)',
            },
            backgroundColor: `${theme.palette.background.default}`,
          }}
        >
          <Scrollbar>
            <ReactJson
              src={JSON.parse(response)}
              theme={isLight ? 'rjv-default' : 'eighties'}
              iconStyle="square"
              enableClipboard={false}
              displayDataTypes={false}
              style={{ backgroundColor: 'transparent', fontSize: '13px' }}
            />
          </Scrollbar>
        </Box>
      )}
      {!loadingResponse && response && !isJsonStr && response.length > 0 && (
        <Stack sx={{ p: expand.value ? 0 : 3, pt: 0.5 }}>
          <Box
            sx={{
              py: 0,
              px: 1.5,
              borderRadius: 1,
              height: {
                xs: 'auto',
                md: expand.value ? 'calc(100vh - 206px)' : 'calc(100vh - 488px)',
              },
              backgroundColor: `${theme.palette.background.default}`,
            }}
          >
            <Scrollbar>
              <Markdown
                sx={{
                  '& p': { fontSize: '14px' },
                  '& .component-image': { my: 1, borderRadius: 1 },
                  '& code': { wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
                  '& a': { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
                  '& pre, & pre > code': { py: 1, lineHeight: 1.75 },
                }}
                children={response}
              />
            </Scrollbar>
          </Box>
        </Stack>
      )}
    </Box>
  );

  return (
    <Card sx={{ height: { xs: 'auto', md: 'calc(100% - 16px)' } }}>
      <CardHeader
        title="Response"
        sx={{ mt: -1, mb: -0.5 }}
        action={
          <IconButton size="small" onClick={expand.onTrue} sx={{ mt: 0.5, mr: 1 }}>
            <Iconify icon="eva:expand-fill" width={18} />
          </IconButton>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

      {resultPanel}

      <Dialog fullWidth maxWidth="lg" open={expand.value} onClose={expand.onFalse}>
        <DialogTitle sx={{ p: (_theme) => _theme.spacing(2, 3, 1, 3) }}>Response</DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', height: 'calc(100vh)' }}>
          {resultPanel}
        </DialogContent>

        <DialogActions>
          <Button size="small" variant="contained" onClick={expand.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
