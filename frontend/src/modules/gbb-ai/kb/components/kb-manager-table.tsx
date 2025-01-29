import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { IDataset } from 'src/types/kb';

import KbManagerTableRow from './kb-manager-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Title', align: 'left', width: 280, maxWidth: 640 },
  { id: 'type', label: 'Type', align: 'left', width: 80 },
  { id: 'createdAt', label: 'Created', align: 'left', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 100, maxWidth: 120 },
  { id: 'modifiedAt', label: 'Modified', align: 'left', width: 100 },
  { id: 'shared', label: 'Modified by', align: 'right', width: 120, maxWidth: 130 },
  { id: '', width: 60, minWidth: 40 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IDataset[];
  notFound: boolean;
  dataFiltered: IDataset[];
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function KbManagerTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
  onOpenConfirm,
}: Props) {
  const theme = useTheme();

  const router = useRouter();

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
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const denseHeight = dense ? 52 : 59;

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.gbbai.kb.details(id));
    },
    [router]
  );

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={dataFiltered.length}
          checkboxMl={0}
          denseCheckboxMl={0}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="error" onClick={onOpenConfirm}>
                <Iconify icon="gravity-ui:trash-bin" width={18} />
              </IconButton>
            </Tooltip>
          }
          sx={{ pl: 2, pr: 2 }}
        />

        <TableContainer>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              dense={dense}
              order={order}
              checkboxMl={1.1}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <KbManagerTableRow
                    key={row.id}
                    row={row}
                    dense={dense}
                    selected={selected.includes(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
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
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
