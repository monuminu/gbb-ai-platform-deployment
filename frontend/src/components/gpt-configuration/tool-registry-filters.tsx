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

import { IToolFilters, IToolFilterType } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = {
  filters: IToolFilters;
  onFilters: (name: string, value: IToolFilterType) => void;
  tagOptions: string[];
};

export default function ToolRegistryFilters({ filters, onFilters, tagOptions }: Props) {
  const tagPopover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
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

  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ width: 1 }}>
      {renderFilterName}

      <Stack
        sx={{ mr: 0 }}
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexGrow={1}
      >
        {renderFilterTags}
      </Stack>
    </Stack>
  );
}
