import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { AppFilterStruct, AppFilterValueStruct } from 'src/types/app';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: AppFilterStruct;
  onFilters: (name: string, value: AppFilterValueStruct) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function AppFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveScenario = (inputValue: string) => {
    const newValue = filters.scenario.filter((item) => item !== inputValue);
    onFilters('scenario', newValue);
  };

  const handleRemoveDataType = () => {
    onFilters('category', 'all');
  };

  return (
    <Stack spacing={1.5} {...other} sx={{ mb: { xs: 3, md: 5 } }}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          Apps found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.scenario.length && (
          <Block label="Scenario:">
            {filters.scenario.map((item) => (
              <Chip
                variant="soft"
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveScenario(item)}
              />
            ))}
          </Block>
        )}

        {filters.category.toLowerCase() !== 'all' && (
          <Block label="Data type:">
            <Chip
              variant="soft"
              size="small"
              label={filters.category}
              onDelete={handleRemoveDataType}
            />
          </Block>
        )}

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
