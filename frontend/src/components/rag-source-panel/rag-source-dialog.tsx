import { useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import {
  Paper,
  Stack,
  Portal,
  Dialog,
  Button,
  Divider,
  CardHeader,
  Typography,
  DialogActions,
} from '@mui/material';

import EmptyContent from 'src/components/empty-content';
import FileThumbnail from 'src/components/file-thumbnail';

import RagSourceChunkPanel from './rag-source-chunk-panel';
import RagSourceDialogTopTable from './rag-source-dialog-top-table';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  flexDirection: 'row',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  ragThoughts: any;
  selectedSource: string;
};

export default function RagSourceDialog({ open, onClose, ragThoughts, selectedSource }: Props) {
  const [selectedFile, setSelectedFile] = useState(selectedSource);

  const sourceFiles = getSourceFiles(ragThoughts) as string[];

  useEffect(() => {
    setSelectedFile(selectedSource);
  }, [selectedSource]);

  const handleSelectSourceFile = useCallback(
    (newValue: string) => {
      if (selectedFile !== newValue) setSelectedFile(newValue);
    },
    [selectedFile]
  );

  const renderSourceFiles = ['All', ...sourceFiles].map((sourceFile) => (
    <Stack
      key={sourceFile}
      spacing={1}
      component={Paper}
      variant="outlined"
      direction="row"
      alignItems="center"
      onClick={() => handleSelectSourceFile(sourceFile)}
      sx={{
        px: 1.75,
        py: 0.5,
        borderRadius: 20,
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        ...(sourceFile === selectedFile && {
          border: (theme) => `1px solid ${theme.palette.info.dark}`,
          boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.info.dark}`,
        }),
      }}
    >
      {sourceFile !== 'All' && (
        <FileThumbnail
          file={sourceFile.toLowerCase() || ''}
          sx={{ width: 18, height: 18, my: '3px' }}
        />
      )}

      <Typography variant="subtitle2" fontSize="13px" lineHeight={1}>
        {`${truncate(sourceFile, 24)} (${getSourceFileChunkNumber(ragThoughts, sourceFile)})`}
      </Typography>
    </Stack>
  ));

  return (
    <Portal>
      <Dialog open={open} onClose={onClose}>
        <RootStyle
          sx={{
            ...{
              top: 0,
              left: 0,
              display: 'flex',
              margin: 'auto',
              width: { xs: '90%', md: '90%', lg: '90%' },
              height: { xs: '90vh', md: '90' },
              // maxWidth: 1100,
            },
          }}
        >
          {(!ragThoughts || ragThoughts.length < 3) && (
            <EmptyContent
              filled
              title="No sources"
              sx={{ py: 12, width: '100%' }}
              imgUrl="/assets/icons/empty/ic_analysis.svg"
            />
          )}
          {ragThoughts && ragThoughts.length > 2 && (
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Sources" sx={{ mb: 2, pt: 2 }} />

              <Divider />

              <RagSourceDialogTopTable
                originalQuery={ragThoughts[0].description}
                generatedQuery={ragThoughts[1].description}
                searchProps={ragThoughts[1].props}
              />

              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  mx: 3.25,
                  mt: 3,
                  mb: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  // overflowX: 'auto',
                  // whiteSpace: 'nowrap',
                  // scrollbarWidth: 'none',
                  // '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {renderSourceFiles}
              </Stack>

              <RagSourceChunkPanel selected={selectedFile} ragThoughts={ragThoughts} />

              <Divider />

              <DialogActions sx={{ py: 2 }}>
                <Button size="medium" variant="outlined" color="inherit" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Stack>
          )}
        </RootStyle>
      </Dialog>
    </Portal>
  );
}

// ----------------------------------------------------------------------

export function getSourceFiles(thoughts: any[] | undefined) {
  if (!thoughts || thoughts.length < 3) {
    return [];
  }

  return [...new Set(thoughts[2].description.map((thought: any) => thought.sourcefile))];
}

function truncate(str: string, num: number) {
  return str.length > num ? `${str.slice(0, num)}...` : str;
}

function getSourceFileChunkNumber(thoughts: any[] | undefined, sourceFile: string) {
  if (!thoughts || thoughts.length < 3) {
    return [];
  }

  const chunks = thoughts[2].description.filter(
    (chunk: any) => sourceFile === 'All' || chunk.sourcefile === sourceFile
  );

  return chunks.length;
}
