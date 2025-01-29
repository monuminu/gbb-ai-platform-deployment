import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  checkboxMl?: number;
  denseCheckboxMl?: number;
  onSelectAllRows: (checked: boolean) => void;
  newTop?: number;
}

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  checkboxMl = 2,
  denseCheckboxMl = 4.5,
  onSelectAllRows,
  sx,
  newTop = 3,
  ...other
}: Props) {
  const theme = useTheme();

  if (!numSelected) {
    return null;
  }

  return (
    <Card
      sx={{
        top: newTop,
        left: 15,
        px: 0.5,
        py: 0.25,
        zIndex: 9,
        borderRadius: 0.75,
        position: 'absolute',
        boxShadow: theme.customShadows.card,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Stack direction="row" alignItems="center" {...other}>
        <Checkbox
          size="small"
          indeterminate={!!numSelected && numSelected < rowCount}
          checked={!!rowCount && numSelected === rowCount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onSelectAllRows(event.target.checked)
          }
          sx={{ ml: dense ? denseCheckboxMl : checkboxMl, p: 0.75 }}
        />

        <Typography
          variant="subtitle2"
          sx={{ ml: 1.25, mr: 1.5, flexGrow: 1, color: 'primary.main' }}
        >
          {numSelected} selected
        </Typography>

        {action && action}
      </Stack>
    </Card>
  );
}
