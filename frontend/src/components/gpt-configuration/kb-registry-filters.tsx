import { useCallback } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomDateRangePicker, { shortDateLabel } from 'src/components/custom-date-range-picker';

import { IDatasetFilters, IDatasetFilterValue } from 'src/types/kb';

// ----------------------------------------------------------------------

type Props = {
  openDateRange: boolean;
  onCloseDateRange: VoidFunction;
  onOpenDateRange: VoidFunction;
  //
  filters: IDatasetFilters;
  onFilters: (name: string, value: IDatasetFilterValue) => void;
  //
  dateError: boolean;
  typeOptions: string[];
};

export default function KbRegistryFilters({
  openDateRange,
  onCloseDateRange,
  onOpenDateRange,
  //
  filters,
  onFilters,
  //
  dateError,
  typeOptions,
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const renderFilterName = (
    <TextField
      size="small"
      value={filters.name}
      onChange={handleFilterName}
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        // maxHeight: 22,
        width: { xs: 1, md: 220 },
      }}
    />
  );

  const renderFilterDate = (
    <>
      <Button
        size="small"
        color="inherit"
        onClick={onOpenDateRange}
        endIcon={
          <Iconify
            icon={openDateRange ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ whiteSpace: 'nowrap' }}
      >
        {!!filters.startDate && !!filters.endDate
          ? shortDateLabel(filters.startDate, filters.endDate)
          : 'Select date'}
      </Button>

      <CustomDateRangePicker
        variant="calendar"
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChangeStartDate={handleFilterStartDate}
        onChangeEndDate={handleFilterEndDate}
        open={openDateRange}
        onClose={onCloseDateRange}
        selected={!!filters.startDate && !!filters.endDate}
        error={dateError}
      />
    </>
  );

  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ width: 1 }}>
      {renderFilterName}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterDate}

        {/* {renderFilterType} */}
      </Stack>
    </Stack>
  );
}
