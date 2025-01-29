import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import Stack, { StackProps } from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';

import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ITool } from 'src/types/tool';

import ToolRegistryTableRow from './tool-registry-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 160 },
  { id: 'description', label: 'Description', width: 220 },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'modifiedAt', label: 'Modified', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 140 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: ITool[];
  notFound: boolean;
  dataFiltered: ITool[];
  onSelectTools: (index: string[]) => void;
};

export default function ToolRegistryTable({
  table,
  tableData,
  notFound,
  dataFiltered,
  onSelectTools,
}: Props) {
  const theme = useTheme();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const handleSelectRow = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(newSelected);
    onSelectTools(newSelected);
  };

  const handleSelectAllRows = (checked: boolean) => {
    const newSelected = checked ? tableData.map((row) => row.id) : [];

    setSelected(newSelected);
    onSelectTools(newSelected);
  };

  return (
    <>
      <Box sx={{ position: 'relative', mx: 0, mt: -1.5 }}>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) => handleSelectAllRows(checked)}
              sx={{ borderBottom: `solid 1px ${theme.palette.divider}`, mb: 4 }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <ToolRegistryTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={48}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        sx={{ borderTop: `solid 1px ${theme.palette.divider}`, mt: -0.25 }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

interface CheckedProps extends StackProps {
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
}

export function CheckedRowHeader({ rowCount, numSelected, onSelectAllRows, sx }: CheckedProps) {
  if (!numSelected) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" sx={{ position: 'absolute', ...sx }}>
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
        sx={{ ml: 0.825, mt: 0.5 }}
      />
    </Stack>
  );
}
