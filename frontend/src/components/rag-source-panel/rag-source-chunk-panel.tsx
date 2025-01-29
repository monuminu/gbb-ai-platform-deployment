import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Scrollbar from 'src/components/scrollbar';

import RagSourceChunk from './rag-source-chunk';

// ----------------------------------------------------------------------

type Props = {
  selected: string;
  ragThoughts: any;
};

export default function RagSourceChunkPanel({ selected, ragThoughts }: Props) {
  const [expandedChunks, setExpandedChunks] = useState<string[]>([]);
  const filteredChunks = ragThoughts[2].description.filter(
    (chunk: any) => selected === 'All' || chunk.sourcefile === selected
  );

  const maxRerankerScore = Math.max(
    ...filteredChunks.map((chunk: any) => chunk.search_reranker_score)
  );

  const maxSearchScore = Math.max(...filteredChunks.map((chunk: any) => chunk.search_score));

  const onExpandChunk = useCallback(
    (inputValue: string) => {
      const newExpanded = expandedChunks.includes(inputValue)
        ? expandedChunks.filter((value) => value !== inputValue)
        : [...expandedChunks, inputValue];

      setExpandedChunks(newExpanded);
    },
    [expandedChunks]
  );

  const onExpandAllChunks = useCallback((inputValue: string[]) => {
    setExpandedChunks(inputValue);
  }, []);

  const onCollapseAllChunks = useCallback(() => {
    setExpandedChunks([]);
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mx: 3.25, mb: 1.5 }}>
        <Button
          variant="text"
          sx={{
            py: 0.25,
            px: 0.5,
            fontSize: '12px',
            fontWeight: 600,
            color: 'text.secondary',
          }}
          onClick={() => onExpandAllChunks(filteredChunks.map((_chunk: any) => _chunk.id))}
        >
          Expand all
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
          |
        </Typography>
        <Button
          sx={{
            py: 0.25,
            px: 0.5,
            fontSize: '12px',
            fontWeight: 600,
            color: 'text.secondary',
          }}
          onClick={() => onCollapseAllChunks()}
        >
          Collapse all
        </Button>
      </Stack>
      <Scrollbar sx={{ flexDirection: 'row' }}>
        {filteredChunks.map((chunk: any) => (
          <RagSourceChunk
            key={chunk.id}
            expanded={expandedChunks.includes(chunk.id)}
            chunk={chunk}
            onExpanded={() => onExpandChunk(chunk.id)}
            maxRerankerScore={maxRerankerScore}
            maxSearchScore={maxSearchScore}
          />
        ))}
      </Scrollbar>
    </>
  );
}
