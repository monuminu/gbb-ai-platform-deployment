import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

import { IToolFilters, IToolFilterType } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IToolFilters;
  onFilters: (name: string, value: IToolFilterType) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function ToolRegistryFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveTags = (inputValue: string) => {
    const newValue = filters.tags.filter((item) => item !== inputValue);
    onFilters('tags', newValue);
  };

  const handleRemoveStatuses = (inputValue: string) => {
    const newValue = filters.statuses.filter((item) => item !== inputValue);
    onFilters('statuses', newValue);
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  return (
    <Stack spacing={1.5} {...other} direction="row" alignItems="center">
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.75 }}>
          found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.tags.length && (
          <Block label="Tags:">
            {filters.tags.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{ textTransform: 'capitalize' }}
                onDelete={() => handleRemoveTags(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.statuses.length && (
          <Block label="Statuses:">
            {filters.statuses.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{ textTransform: 'capitalize' }}
                onDelete={() => handleRemoveStatuses(item)}
              />
            ))}
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Date:" sx={{ py: 0.75, px: 0.75 }}>
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        {canReset && (
          <Button
            size="small"
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

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
