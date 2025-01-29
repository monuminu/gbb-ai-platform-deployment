import { useCallback } from 'react';
// import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';

import {
  Box,
  Badge,
  Radio,
  Stack,
  Button,
  Drawer,
  Divider,
  Tooltip,
  Checkbox,
  FormGroup,
  Typography,
  IconButton,
  FormControlLabel,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { AppFilterStruct, AppFilterValueStruct } from 'src/types/app';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
];

export const FILTER_SCENARIO_OPTIONS = [
  'Sports',
  'Retail',
  'Finance',
  'Agriculture',
  'Health Care',
  'Manufacturing',
  'Transportation',
  'QA Bot',
  'LLM',
];

export const FILTER_DATA_OPTIONS = ['All', 'Image', 'Video', 'CSV', 'Text', 'Audio'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: AppFilterStruct;
  onFilters: (name: string, value: AppFilterValueStruct) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
};

export default function AppFilterSidebar({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
}: Props) {
  const handleFilterScenario = useCallback(
    (newValue: string) => {
      const checked = filters.scenario.includes(newValue)
        ? filters.scenario.filter((value) => value !== newValue)
        : [...filters.scenario, newValue];
      onFilters('scenario', checked);
    },
    [filters.scenario, onFilters]
  );

  const handleFilterDataType = useCallback(
    (newValue: string) => {
      onFilters('category', newValue);
    },
    [onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon={refreshFill} />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon={closeFill} />
      </IconButton>
    </Stack>
  );

  const renderScenario = (
    <Stack>
      <Typography variant="subtitle1" gutterBottom>
        Scenario
      </Typography>
      <FormGroup>
        {FILTER_SCENARIO_OPTIONS.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                onClick={() => handleFilterScenario(option)}
                checked={filters.scenario.includes(option)}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderDataType = (
    <Stack>
      <Typography variant="subtitle1" gutterBottom>
        Data Type
      </Typography>

      {FILTER_DATA_OPTIONS.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.category}
              onClick={() => handleFilterDataType(option)}
            />
          }
          label={option}
          sx={{
            ...(option === 'all' && {
              textTransform: 'capitalize',
            }),
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Box>
      <Button
        disableRipple
        color="inherit"
        // endIcon={<Icon icon={roundFilterList} />}
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon={roundFilterList} />
          </Badge>
        }
        onClick={onOpen}
        sx={{ px: 1.5 }}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderScenario}

            {renderDataType}
          </Stack>
        </Scrollbar>

        {/* <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetFilter}
            startIcon={<Icon icon={roundClearAll} />}
          >
            Clear All
          </Button>
        </Box> */}
      </Drawer>
    </Box>
  );
}
