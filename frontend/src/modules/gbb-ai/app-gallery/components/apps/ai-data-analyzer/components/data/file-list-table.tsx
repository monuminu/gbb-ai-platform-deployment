import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IFile } from 'src/types/file';

import FileListTableRow from './file-list-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'size', label: 'Size', width: 70 },
  { id: 'type', label: 'Type', width: 40 },
  { id: '', width: 40 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IFile[];
  notFound: boolean;
  dataFiltered: IFile[];
  // onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function FileListTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
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
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const denseHeight = dense ? 58 : 78;

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        {/* <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.id)
            )
          }
          action={
            <>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="ic:baseline-share" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="gravity-ui:trash-bin" width={18} />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        /> */}

        <TableContainer sx={{ p: theme.spacing(0, 3, 0, 3) }}>
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 160,
              borderCollapse: 'separate',
              borderSpacing: '0 14px',
            }}
          >
            <TableHeadCustom
              order={order}
              checkboxPl={1.25}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                },
              }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <FileListTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => onDeleteRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
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
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
