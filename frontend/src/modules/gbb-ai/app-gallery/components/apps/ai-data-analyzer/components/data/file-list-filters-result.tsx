import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { IFileFilters, IFileFilterValue } from 'src/types/file';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IFileFilters;
  onFilters: (name: string, value: IFileFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function FileListFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="gravity-ui:trash-bin" width={18} />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
