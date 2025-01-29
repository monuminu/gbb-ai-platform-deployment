import { useCallback } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomDateRangePicker from 'src/components/custom-date-range-picker';

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
  tagOptions: string[];
};

export default function FileManagerFilters({
  openDateRange,
  onCloseDateRange,
  onOpenDateRange,
  //
  filters,
  onFilters,
  //
  dateError,
  tagOptions,
}: Props) {
  const popover = usePopover();

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

  const handleFilterTags = useCallback(
    (newValue: string) => {
      const checked = filters.tags.includes(newValue)
        ? filters.tags.filter((value) => value !== newValue)
        : [...filters.tags, newValue];
      onFilters('tags', checked);
    },
    [filters.tags, onFilters]
  );

  const handleResetTags = useCallback(() => {
    popover.onClose();
    onFilters('tags', []);
  }, [onFilters, popover]);

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
      sx={{ width: { xs: 1, md: 220 } }}
    />
  );

  const renderFilterTags = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2, borderRadius: 8 }}
      >
        Tags
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {tagOptions.map((type) => {
              const selected = filters.tags.includes(type);

              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterTags(type)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="outlined" color="inherit" onClick={handleResetTags}>
              Clear
            </Button>

            <Button size="small" variant="contained" onClick={popover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterDate = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={onOpenDateRange}
        endIcon={
          <Iconify
            icon={openDateRange ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2, borderRadius: 8 }}
      >
        Created
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
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      justifyContent="space-between"
      sx={{ width: { xs: 1, md: 'auto' } }}
    >
      {renderFilterName}

      <Stack
        spacing={{ xs: 2, md: 1 }}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {renderFilterDate}

        {renderFilterTags}
      </Stack>
    </Stack>
  );
}
