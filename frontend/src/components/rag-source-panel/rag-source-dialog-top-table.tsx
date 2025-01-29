import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { ColorType } from 'src/custom/palette';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

const TABLE_HEADS = [
  { id: 'originalQuery', label: 'Original query', width: 160, minWidth: 140, maxWidth: 200 },
  {
    id: 'generatedQuery',
    label: 'Generated search query',
    width: 160,
    minWidth: 140,
    maxWidth: 200,
  },
  { id: 'retrievalMode', label: 'Retrieval mode', width: 100, minWidth: 60, maxWidth: 140 },
  {
    id: 'useSemanticRanker',
    label: 'Use semantic ranker',
    width: 110,
    minWidth: 100,
    maxWidth: 140,
  },
  {
    id: 'useSemanticCaption',
    label: 'Use semantic caption',
    width: 110,
    minWidth: 80,
    maxWidth: 140,
  },
];

const TableHeaderStyle = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.25),
  paddingBottom: theme.spacing(1),
  backgroundColor: 'transparent',
  '&::after': { borderBottom: 'none' },
}));

const TableRowStyle = styled(TableCell)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.25),
  paddingBottom: theme.spacing(0),
}));

// ----------------------------------------------------------------------

type Props = {
  originalQuery: string;
  generatedQuery: string;
  searchProps: any;
};

export default function RagSourceDialogTopTable({
  originalQuery,
  generatedQuery,
  searchProps,
}: Props) {
  // const hasVector = props ? props.has_vector : 'N/A';
  const retrievalMode = searchProps ? searchProps.retrieval_mode : 'N/A';
  const useSemanticRanker = searchProps ? searchProps.use_semantic_ranker : 'N/A';
  const useSemanticCaption = searchProps ? searchProps.use_semantic_captions : 'N/A';

  return (
    <Paper sx={{ mx: 3.25, mt: 2.5, pt: 0.5, pb: 1, bgcolor: 'background.neutral' }}>
      <TableContainer sx={{ overflowY: 'hidden', py: 0.5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADS.map((head) => (
                <TableHeaderStyle
                  key={head.id}
                  align={head.id === 'activity' ? 'center' : 'left'}
                  sx={{
                    width: head.width,
                    minWidth: head.minWidth,
                    maxWidth: head.maxWidth,
                    pl: 2.25,
                  }}
                >
                  {head.label}
                </TableHeaderStyle>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableRowStyle align="left" sx={{ px: 2.5, color: 'text.primary', maxWidth: 380 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {originalQuery || 'N/A'}
                </Typography>
              </TableRowStyle>

              <TableRowStyle align="left" sx={{ px: 2.25, color: 'text.primary', maxWidth: 380 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {generatedQuery || 'N/A'}
                </Typography>
              </TableRowStyle>

              <TableRowStyle align="left" sx={{ pl: 2.25 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {retrievalMode || 'N/A'}
                </Typography>
              </TableRowStyle>

              <TableRowStyle align="left" sx={{ pl: 2.25 }}>
                <Label variant="soft" color={getColor(useSemanticRanker)}>
                  {useSemanticRanker.toString()}
                </Label>
              </TableRowStyle>

              <TableRowStyle align="left" sx={{ pl: 2.25 }}>
                <Label variant="soft" color={getColor(useSemanticCaption)}>
                  {useSemanticCaption.toString()}
                </Label>
              </TableRowStyle>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

// ----------------------------------------------------------------------

function getColor(status: boolean) {
  let color = 'default';
  switch (status) {
    case true:
      color = 'success';
      break;
    case false:
      color = 'error';
      break;
    default:
      color = 'default';
      break;
  }
  return color as ColorType;
}
