import numeral from 'numeral';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, Paper, Button, Collapse, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import Markdown from 'src/components/markdown';
import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  width: '100%',
  height: 24,
  borderRadius: 0,
  overflowY: 'hidden',
  paddingLeft: theme.spacing(0.5),
}));

const ChunkStackStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  flexShrink: 0,
  paddingY: theme.spacing(1),
  paddingLeft: theme.spacing(0.25),
  paddingRight: theme.spacing(1.5),
  borderRight: `1.5px solid ${alpha(theme.palette.text.disabled, 0.58)}`,
}));

// ----------------------------------------------------------------------

type Props = {
  chunk: {
    id: string;
    content: string;
    category: string;
    sourcepage: string;
    sourcefile: string;
    search_score: number;
    search_reranker_score: number;
  };
  expanded: boolean;
  onExpanded: VoidFunction;
  maxSearchScore: number;
  maxRerankerScore: number;
};

export default function RagSourceChunk({
  chunk,
  expanded,
  onExpanded,
  maxSearchScore,
  maxRerankerScore,
}: Props) {
  const smUp = useResponsive('up', 'sm');
  const [currentTab, setCurrentTab] = useState('Preview');

  // console.log(chunk);
  const { content, category, sourcepage, sourcefile, search_score, search_reranker_score } = chunk;

  return (
    <Paper sx={{ p: 1, mx: 3.25, mb: 1.5, mt: 0, bgcolor: 'background.neutral' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <CollapseButtonStyle
          // disableRipple
          onClick={onExpanded}
          startIcon={
            <Icon
              icon={expanded ? arrowIosDownwardFill : arrowIosForwardFill}
              width={16}
              height={16}
            />
          }
          sx={{
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'transparent' },
            color: 'text.primary',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {search_reranker_score && (
            <ChunkStackStyle direction="row" spacing={1}>
              <LinearProgress
                value={Math.floor((search_reranker_score / maxRerankerScore) * 100)}
                variant="determinate"
                color="primary"
                sx={{ width: '60px', height: 6 }}
              />

              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Reranker score:
              </Typography>

              <Typography variant="caption" fontSize="13px" sx={{ width: 36, textAlign: 'left' }}>
                {numeral(search_reranker_score).format('0.000')}
              </Typography>
            </ChunkStackStyle>
          )}

          {search_score && (
            <ChunkStackStyle
              direction="row"
              spacing={1}
              sx={{ ml: search_reranker_score ? 1.5 : 0 }}
            >
              <LinearProgress
                value={Math.floor((search_score / maxSearchScore) * 100)}
                variant="determinate"
                color="warning"
                sx={{ width: '60px', height: 6 }}
              />

              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Search score:
              </Typography>

              <Typography variant="caption" fontSize="13px" sx={{ width: 42 }}>
                {numeral(search_score).format('0.0000')}
              </Typography>
            </ChunkStackStyle>
          )}

          <ChunkStackStyle direction="row" spacing={0.75} sx={{ ml: 1.25 }}>
            <Typography variant="caption" sx={{ flexShrink: 0, fontWeight: 600 }}>
              Source:
            </Typography>
            <FileThumbnail
              file={sourcefile.toLowerCase() || ''}
              sx={{ width: 18, height: 18, py: 0 }}
            />
            <Typography variant="caption" fontSize="13px">
              {sourcefile}
            </Typography>
          </ChunkStackStyle>

          <ChunkStackStyle direction="row" spacing={0.75} sx={{ ml: 1.25 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Category:
            </Typography>

            <Typography variant="caption" fontSize="13px" sx={{ whiteSpace: 'nowrap' }}>
              {category}
            </Typography>
          </ChunkStackStyle>

          <ChunkStackStyle direction="row" spacing={0.75} sx={{ ml: 1.25, borderRight: 'none' }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Page:
            </Typography>

            <Typography variant="caption" fontSize="13px">
              {sourcepage}
            </Typography>
          </ChunkStackStyle>
        </CollapseButtonStyle>
      </Box>

      <Box sx={{ mb: expanded ? 0.5 : 0 }}>
        <Collapse in={expanded}>
          <Tabs
            value={currentTab}
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
            sx={{ mt: 0.75, mb: 2.25, mx: 1.5, minHeight: 38, justifyContent: 'center' }}
          >
            {['Preview', 'Raw'].map((tab) => (
              <Tab
                disableRipple
                key={tab}
                value={tab}
                label={tab}
                style={{ marginRight: 24, minWidth: 20 }}
                sx={{ mr: 0.25, minHeight: 36 }}
              />
            ))}
          </Tabs>

          <Box sx={{ my: 1, mx: 1.5 }}>
            {currentTab === 'Raw' && (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitBoxOrient: 'vertical',
                  // WebkitLineClamp: 5,
                }}
              >
                {content}
              </Typography>
            )}

            {currentTab === 'Preview' && (
              <Markdown
                sx={{
                  '& .component-image': { mt: 1.5, borderRadius: 1 },
                  '& code': { fontSize: '13px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
                  '& pre, & pre > code': { py: 1, fontSize: '14px', lineHeight: 1.5 },
                  ...(!smUp && {
                    '& pre, & pre > code': { py: 1, lineHeight: 1.5, whiteSpace: 'pre-wrap' },
                  }),
                  '& .MuiBox-root, p': { fontSize: '15px' },
                  '& a': {},
                }}
                // children={content
                //   .replaceAll('<button', '<div')
                //   .replaceAll('<Button', '<div')
                //   .replaceAll('</button>', '</div>')
                //   .replaceAll('</Button>', '</div>')}
                children={content}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}
