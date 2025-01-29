import { useCallback } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomDateRangePicker, { shortDateLabel } from 'src/components/custom-date-range-picker';

import { IToolFilters, IToolFilterType } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = {
  openDateRange: boolean;
  onCloseDateRange: VoidFunction;
  onOpenDateRange: VoidFunction;
  //
  filters: IToolFilters;
  onFilters: (name: string, value: IToolFilterType) => void;
  //
  dateError: boolean;
  tagOptions: string[];
  statusOptions: string[];
};

export default function ToolRegistryFilters({
  openDateRange,
  onCloseDateRange,
  onOpenDateRange,
  //
  filters,
  onFilters,
  //
  dateError,
  tagOptions,
  statusOptions,
}: Props) {
  const tagPopover = usePopover();
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

  const handleFilterStatuses = useCallback(
    (newValue: string) => {
      const checked = filters.statuses.includes(newValue)
        ? filters.statuses.filter((value) => value !== newValue)
        : [...filters.statuses, newValue];
      onFilters('statuses', checked);
    },
    [filters.statuses, onFilters]
  );

  const handleResetStatuses = useCallback(() => {
    statusPopover.onClose();
    onFilters('statuses', []);
  }, [onFilters, statusPopover]);

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
    tagPopover.onClose();
    onFilters('tags', []);
  }, [onFilters, tagPopover]);

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
        onClick={tagPopover.onOpen}
        endIcon={
          <Iconify
            icon={tagPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2, borderRadius: 8 }}
      >
        Tags
      </Button>

      <CustomPopover open={tagPopover.open} onClose={tagPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {tagOptions.map((tag) => {
              const selected = filters.tags.includes(tag);

              return (
                <Stack
                  key={tag}
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  onClick={() => handleFilterTags(tag)}
                  sx={{
                    px: 1.75,
                    py: 1.25,
                    borderRadius: 20,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textTransform: 'capitalize',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    ...(selected && {
                      border: (theme) => `1px solid ${theme.palette.info.dark}`,
                      boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.info.dark}`,
                    }),
                  }}
                >
                  <Typography variant="subtitle2" fontSize="13px" lineHeight={1}>
                    {tag}
                  </Typography>
                </Stack>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetTags}>
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
                <Stack
                  key={status}
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  onClick={() => handleFilterStatuses(status)}
                  sx={{
                    px: 1.75,
                    py: 1.25,
                    borderRadius: 20,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textTransform: 'capitalize',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    ...(selected && {
                      border: (theme) => `1px solid ${theme.palette.info.dark}`,
                      boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.info.dark}`,
                    }),
                  }}
                >
                  <Typography variant="subtitle2" fontSize="13px" lineHeight={1}>
                    {status}
                  </Typography>
                </Stack>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetStatuses}>
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
        {!!filters.startDate && !!filters.endDate
          ? shortDateLabel(filters.startDate, filters.endDate)
          : 'Created'}
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
      sx={{ width: { xs: 1, md: 'auto' } }}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      {renderFilterName}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 2, md: 1 }}
      >
        {renderFilterDate}

        {renderFilterTags}

        {renderFilterStatus}
      </Stack>
    </Stack>
  );
}
