import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  meta: string;
  updateMeta: (value: string) => void;
};

export default function ToolDetailTabsCodeMeta({ meta, updateMeta }: Props) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const onChange = (newValue: string) => updateMeta(newValue);

  return (
    <Box
      sx={{
        minHeight: 200,
        maxHeight: 'calc(100vh - 512px)',
        height: meta.split('\n').length * 20.75,
        py: 0.5,
        borderRadius: 1,
        border: `solid 1px ${theme.palette.divider}`,
        backgroundColor: `${theme.palette.background.paper}`,
        mb: 3,
      }}
    >
      <AceEditor
        mode="json"
        value={meta}
        theme={isLight ? 'textmate' : 'tomorrow_night_bright'}
        onChange={onChange}
        name="blah2"
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
  );
}
