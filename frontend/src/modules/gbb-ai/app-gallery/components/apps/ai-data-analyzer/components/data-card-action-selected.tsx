import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { Theme, SxProps } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  rowCount: number;
  numSelected: number;
  selected?: string[];
  action?: React.ReactNode;
  onSelectAllItems: (checked: boolean) => void;
  sx?: SxProps<Theme>;
};

export default function DataCardActionSelected({
  action,
  selected,
  rowCount,
  numSelected,
  onSelectAllItems,
  sx,
  ...other
}: Props) {
  return (
    <Box
      sx={{
        zIndex: 9,
        right: -16,
        bottom: -16,
        display: 'flex',
        borderRadius: '8px',
        position: 'absolute',
        alignItems: 'center',
        bgcolor: 'text.primary',
        p: (theme) => theme.spacing(0.5, 1, 0.5, 0.25),
        boxShadow: (theme) => theme.customShadows.z20,
        m: { xs: 2, md: 3 },
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllItems(event.target.checked)
        }
        icon={<Iconify icon="eva:radio-button-off-fill" />}
        checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
        indeterminateIcon={<Iconify icon="eva:minus-circle-fill" />}
      />

      {selected && (
        <Typography
          variant="subtitle2"
          sx={{
            mr: 2,
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          }}
        >
          {selected.length} {selected.length > 1 ? 'cards' : 'card'} selected
        </Typography>
      )}

      {action && action}
    </Box>
  );
}
