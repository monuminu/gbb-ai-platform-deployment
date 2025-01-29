import { useCallback } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomDateRangePicker from 'src/components/custom-date-range-picker';

import { IKbTableFilters, IDatasetFilterValue } from 'src/types/kb';

// ----------------------------------------------------------------------

type Props = {
  openDateRange: boolean;
  onCloseDateRange: VoidFunction;
  onOpenDateRange: VoidFunction;
  //
  filters: IKbTableFilters;
  onFilters: (name: string, value: IDatasetFilterValue) => void;
  //
  dateError: boolean;
  typeOptions: string[];
  statusOptions: string[];
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
  typeOptions,
  statusOptions,
}: Props) {
  const typePopover = usePopover();
  const statusPopover = usePopover();

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

  const handleFilterType = useCallback(
    (newValue: string) => {
      const checked = filters.types.includes(newValue)
        ? filters.types.filter((value) => value !== newValue)
        : [...filters.types, newValue];
      onFilters('types', checked);
    },
    [filters.types, onFilters]
  );

  const handleResetType = useCallback(() => {
    typePopover.onClose();
    onFilters('types', []);
  }, [onFilters, typePopover]);

  const handleFilterStatus = useCallback(
    (newValue: string) => {
      const checked = filters.statuses.includes(newValue)
        ? filters.statuses.filter((value) => value !== newValue)
        : [...filters.statuses, newValue];
      onFilters('statuses', checked);
    },
    [filters.statuses, onFilters]
  );

  const handleResetStatus = useCallback(() => {
    statusPopover.onClose();
    onFilters('statuses', []);
  }, [onFilters, statusPopover]);

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

  const renderFilterType = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={typePopover.onOpen}
        endIcon={<Iconify icon={typePopover.open ? arrowIosUpwardFill : arrowIosDownwardFill} />}
        sx={{ px: 1.5, py: 2, borderRadius: 8 }}
      >
        Types
      </Button>

      <CustomPopover open={typePopover.open} onClose={typePopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {typeOptions.map((type) => {
              const selected = filters.types.includes(type);

              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterType(type)}
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
                  <Stack spacing={1.25} direction="row" alignItems="center">
                    <FileThumbnail file={type} sx={{ width: 22, height: 22 }} />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetType}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterStatus = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={statusPopover.onOpen}
        endIcon={
          <Iconify
            icon={statusPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2, borderRadius: 8 }}
      >
        Status
      </Button>

      <CustomPopover open={statusPopover.open} onClose={statusPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {statusOptions.map((status) => {
              const selected = filters.statuses.includes(status);

              return (
                <CardActionArea
                  key={status}
                  onClick={() => handleFilterStatus(status)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && { bgcolor: 'action.selected' }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{status}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetStatus}>
              Clear
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
      justifyContent="space-between"
      sx={{ width: { xs: 1, md: 'auto' } }}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      {renderFilterName}

      <Stack
        spacing={{ xs: 2, md: 1 }}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {renderFilterDate}

        {renderFilterType}

        {renderFilterStatus}
      </Stack>
    </Stack>
  );
}
