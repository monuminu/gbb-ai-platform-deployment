import { useCallback } from 'react';

// mui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tablePaginationClasses } from '@mui/material/TablePagination';

// project import
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

import { ITool } from 'src/types/tool';

import ToolRegistryTableRow from './tool-registry-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 200 },
  { id: 'description', label: 'Description', width: 280 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 120 },
  { id: 'modifiedAt', label: 'Modified', width: 90 },
  { id: 'shared', label: 'Modified by', align: 'right', width: 100 },
  { id: '', width: 60 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: ITool[];
  notFound: boolean;
  dataFiltered: ITool[];
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function ToolRegistryTable({
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

  const denseHeight = dense ? 52 : 64;

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.gbbai.function.details(id));
    },
    [router]
  );

  return (
    <>
      <Box sx={{ position: 'relative', mx: 0, mt: -2 }}>
        <TableSelectedAction
          dense={dense}
          sx={{ px: 2 }}
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
              <IconButton size="small" color="error" onClick={onOpenConfirm}>
                <Iconify icon="gravity-ui:trash-bin" width={18} />
              </IconButton>
            </Tooltip>
          }
        />

        <TableContainer>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              dense={dense}
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              checkboxMl={1.1}
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
                  <ToolRegistryTableRow
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
