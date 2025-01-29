import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IDataset } from 'src/types/kb';

import KbManagerTableRow from './kb-registry-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'blank', label: '', align: 'left', width: 40 },
  { id: 'name', label: 'Title', align: 'left', width: 220 },
  { id: 'type', label: 'Type', align: 'left', width: 120 },
  { id: 'createdAt', label: 'Created', align: 'left', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 120 },
  { id: 'modifiedAt', label: 'Modified', align: 'left', width: 140 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IDataset[];
  notFound: boolean;
  dataFiltered: IDataset[];
  //
  onRefresh: () => void;
  onSelectIndex: (index: string) => void;
};

export default function KbRegistryTable({
  table,
  tableData,
  notFound,
  dataFiltered,
  onSelectIndex,
  onRefresh,
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
    setSelected([id]);

    const row = dataFiltered.find((_row) => _row.id === id);
    onSelectIndex(row?.index || '');
  };

  const denseHeight = dense ? 48 : 72;

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
              sx={{ borderBottom: `solid 1px ${theme.palette.divider}`, mb: 4 }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <KbManagerTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id)}
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

      {/* <IconButton
        size="small"
        onClick={handleRefresh}
        sx={{
          zIndex: 1999,
          width: 32,
          height: 32,
          color: 'inherit',
          position: 'absolute',
          bottom: 16,
          left: 12,
        }}
      >
        <Iconify icon={refreshFill} />
      </IconButton> */}

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
