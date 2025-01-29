import { Theme, alpha } from '@mui/material/styles';
import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function table(theme: Theme) {
  const tableContainerStyles = {
    root: {
      position: 'relative',
    },
  };

  const tableRowStyles = {
    root: {
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: alpha(theme.palette.primary.dark, 0.04),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.dark, 0.08),
        },
      },
      '&:last-of-type': {
        [`& .${tableCellClasses.root}`]: {
          borderColor: 'transparent',
        },
      },
    },
  };

  const tableCellStyles = {
    root: {
      borderBottomStyle: 'dashed',
    },
    head: {
      fontSize: 14,
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightSemiBold,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderBottom: `1.5px solid ${theme.palette.background.neutral}`,
      },
    },
    stickyHeader: {
      backgroundColor: theme.palette.background.paper,
      backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
    },
    paddingCheckbox: {
      paddingLeft: theme.spacing(1),
    },
  };

  const tablePaginationStyles = {
    root: {
      width: '100%',
    },
    toolbar: {
      height: 64,
    },
    actions: {
      marginRight: 8,
    },
    select: {
      paddingLeft: 8,
      '&:focus': {
        borderRadius: theme.shape.borderRadius,
      },
    },
    selectIcon: {
      right: 2,
      width: 18,
      height: 18,
    },
  };

  return {
    MuiTableContainer: {
      styleOverrides: tableContainerStyles,
    },
    MuiTableRow: {
      styleOverrides: tableRowStyles,
    },
    MuiTableCell: {
      styleOverrides: tableCellStyles,
    },
    MuiTablePagination: {
      styleOverrides: tablePaginationStyles,
    },
  };
}
