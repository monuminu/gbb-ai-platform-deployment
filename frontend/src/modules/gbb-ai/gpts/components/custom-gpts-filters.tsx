import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// import FileThumbnail from 'src/components/file-thumbnail';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomDateRangePicker, { shortDateLabel } from 'src/components/custom-date-range-picker';

import { ICustomGptFilters, ICustomGptFilterValue } from 'src/types/app';

// ----------------------------------------------------------------------

type Props = {
  openDateRange: boolean;
  onCloseDateRange: VoidFunction;
  onOpenDateRange: VoidFunction;
  //
  filters: ICustomGptFilters;
  onFilters: (name: string, value: ICustomGptFilterValue) => void;
  //
  dateError: boolean;
  typeOptions: string[];
};

export default function CustomGptFilters({
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
  const popover = usePopover();

  const renderLabel = filters.categories.length
    ? filters.categories.slice(0, 2).join(',')
    : 'All categories';

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
      const checked = filters.categories.includes(newValue)
        ? filters.categories.filter((value) => value !== newValue)
        : [...filters.categories, newValue];
      onFilters('categories', checked);
    },
    [filters.categories, onFilters]
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    onFilters('categories', []);
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
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: 1, md: 260 },
      }}
    />
  );

  const renderFilterType = (
    <>
      <Button
        size="small"
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderLabel}
        {filters.categories.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.categories.length - 2}
          </Label>
        )}
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
            {typeOptions.map((type) => {
              const selected = filters.categories.includes(type);

              return (
                // <CardActionArea
                //   key={type}
                //   onClick={() => handleFilterType(type)}
                //   sx={{
                //     p: 1,
                //     borderRadius: 1,
                //     cursor: 'pointer',
                //     border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                //     ...(selected && {
                //       bgcolor: 'action.selected',
                //     }),
                //   }}
                // >
                //   <Stack spacing={1} direction="row" alignItems="center">
                //     <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                //   </Stack>
                // </CardActionArea>

                <Stack
                  key={type}
                  spacing={1}
                  // component={Paper}
                  // variant="outlined"
                  direction="row"
                  alignItems="center"
                  onClick={() => handleFilterType(type)}
                  sx={{
                    px: 1.75,
                    py: 1.25,
                    borderRadius: 20,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    ...(selected && {
                      border: (theme) => `1px solid ${theme.palette.info.dark}`,
                      boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.info.dark}`,
                    }),
                  }}
                >
                  <Typography variant="subtitle2" fontSize="13px" lineHeight={1}>
                    {type}
                  </Typography>
                </Stack>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="outlined" color="inherit" onClick={handleResetType}>
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
        color="inherit"
        onClick={onOpenDateRange}
        endIcon={
          <Iconify
            icon={openDateRange ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
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
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterDate}

        {renderFilterType}
      </Stack>
    </Stack>
  );
}
