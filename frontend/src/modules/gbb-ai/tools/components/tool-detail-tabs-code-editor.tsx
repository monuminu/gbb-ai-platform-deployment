import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

// mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// project imports
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  code: string;
  codeType: string;
  entryFunction: string;
  updateCode: (value: string) => void;
  updateEntryFunction: (value: string | string[] | null) => void;
};

export default function ToolDetailTabsCodeEditor({
  code,
  codeType,
  entryFunction,
  updateCode,
  updateEntryFunction,
}: Props) {
  const theme = useTheme();

  const expand = useBoolean();

  const isLight = theme.palette.mode === 'light';

  const functionNames = getFunctionName(code);

  const onChange = (newValue: string) => updateCode(newValue);

  const codeEditor = (inDialog: boolean) => (
    <Box
      sx={{
        py: 0.75,
        minHeight: 300,
        borderRadius: 1,
        mb: inDialog ? 0 : 3,
        height: code.split('\n').length * 20.5,
        backgroundColor: `${theme.palette.background.default}`,
        maxHeight: inDialog ? 'calc(100vh - 210px)' : 'calc(100vh - 602px)',
      }}
    >
      <AceEditor
        mode={codeType.toLowerCase() === 'python' ? 'python' : 'json'}
        value={code}
        onChange={onChange}
        showPrintMargin={false}
        fontSize={13}
        height="100%"
        width="100%"
        editorProps={{ $blockScrolling: true }}
        theme={isLight ? 'textmate' : 'tomorrow_night_bright'}
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
          backgroundColor: `${theme.palette.background.default}`,
        }}
      />

      {!inDialog && (
        <IconButton
          onClick={expand.onTrue}
          sx={{
            p: 0,
            right: 26,
            bottom: 26,
            zIndex: 9,
            opacity: 1,
            width: '18px',
            height: '18px',
            position: 'absolute',
            bgcolor: 'transparent',
            justifyContent: 'center',
            '&:hover': { opacity: 0.8 },
          }}
        >
          <Iconify icon="eva:expand-fill" width={18} />
        </IconButton>
      )}
    </Box>
  );

  return (
    <>
      {codeType.toLowerCase() === 'python' && (
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            // border: `solid 1px ${theme.palette.divider}`,
            backgroundColor: `${theme.palette.background.default}`,
          }}
        >
          <Box sx={{ pb: 0.25, ml: 1 }}>
            <Typography
              noWrap
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ height: '100%' }}
            >
              Entry function
            </Typography>
          </Box>

          <Divider sx={{ height: 30, m: 0.5, ml: 1.5 }} orientation="vertical" />

          <RHFAutocomplete
            name="entryFunction"
            size="small"
            sx={{
              ml: -0.75,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
            value={entryFunction}
            onChange={(_, newValue) => updateEntryFunction(newValue)}
            placeholder="Select entry function"
            options={functionNames.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected) => selected.map((option) => option)}
          />
        </Paper>
      )}

      {codeEditor(false)}

      <Dialog fullWidth maxWidth="lg" open={expand.value} onClose={expand.onFalse}>
        <DialogTitle sx={{ p: (_theme) => _theme.spacing(2, 3, 1, 3) }}>Code</DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', height: 1 }}>
          {codeEditor(true)}
        </DialogContent>

        <DialogActions>
          <Button size="small" variant="contained" onClick={expand.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function getFunctionName(str: string) {
  const matches = str.match(/def (\w+)\(/g);
  return matches ? matches.map((match) => match.replace('def ', '').replace('(', '')) : [];
}
