import { useState } from 'react';
import { useSnackbar } from 'notistack';
import flashFill from '@iconify/icons-mingcute/flash-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { useBoolean } from 'src/hooks/use-boolean';

import { indexFiles } from 'src/api/kmm';
import { STATUS_OPTIONS } from 'src/constants';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import {
  KbItemManager,
  IKbTableFilters,
  RagSourceManager,
  IDatasetFilterValue,
} from 'src/types/kb';

import FileManagerCopilot from './file-manager-copilot';
import FileManagerFilters from './file-manager-filters';
import FileManagerTableRow from './file-manager-table-row';
import FileManagerFiltersResult from './file-manager-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: 200, maxWidth: 300 },
  { id: 'chunks', label: 'Chunks', width: 100, align: 'center' },
  { id: 'status', label: 'Status', width: 100, maxWidth: 120 },
  { id: 'size', label: 'Size', width: 80, maxWidth: 140 },
  { id: 'type', label: 'Type', width: 80, maxWidth: 140 },
  { id: 'modifiedAt', label: 'Modified', width: 110 },
  { id: 'shared', label: 'Modified by', align: 'right', width: 110, minWidth: 110, maxWidth: 120 },
  { id: '', width: 60, minWidth: 40 },
];

// ----------------------------------------------------------------------

type Props = {
  kbId: string;
  indexName: string;
  table: TableProps;
  tableData: KbItemManager[];
  notFound: boolean;
  dataFiltered: KbItemManager[];
  filters: IKbTableFilters;
  dateError: boolean;
  canReset: boolean;
  onFilters: (name: string, value: IDatasetFilterValue) => void;
  onResetFilters: () => void;
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
  onUpdateRow: (newRow: KbItemManager) => void;
};

export default function FileManagerTable({
  kbId,
  indexName,
  table,
  tableData,
  notFound,
  dataFiltered,
  filters,
  dateError,
  canReset,
  onDeleteRow,
  onFilters,
  onResetFilters,
  onOpenConfirm,
  onUpdateRow,
}: Props) {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const [copilotTrigger, setCopilotTrigger] = useState('');

  const [startIndexing, setStartIndexing] = useState(false);

  const allTypes = Array.from(new Set(tableData.map((dataset) => dataset.type).flat()));

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const handleClick = (trigger: string) => {
    setCopilotTrigger(trigger);
  };

  const handleStartIndexing = async () => {
    selected.forEach((id) => {
      const file = dataFiltered.find((row) => row.id === id);
      if (!file) return;

      const payload = {
        filePrefix: file.name,
        indexName,
        containerName: file.storage.container,
      };
      onUpdateRow({ ...file, status: 'Preparing...' });
      setStartIndexing(true);
      indexFiles(kbId, id, payload)
        .then(() => setStartIndexing(false))
        .catch((error) => {
          enqueueSnackbar(error, { variant: 'error' });
          console.error('An error occurred while indexing the file:', error);
        });
    });
    setSelected([]);
  };

  const handleIndex = () => {
    const selectedRows = tableData.filter((row) => selected.includes(row.id));
    const indexedRows = selectedRows.filter((row) => row.status === 'Indexed');
    if (indexedRows.length > 0) {
      confirm.onTrue();
    } else {
      handleStartIndexing();
    }
  };

  const selectedKbs: RagSourceManager[] = dataFiltered
    .filter((row) => selected.includes(row.id))
    .map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      index: indexName,
      status: row.status,
    }));

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={onFilters}
        //
        dateError={dateError}
        typeOptions={allTypes}
        statusOptions={STATUS_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={onResetFilters}
      //
      canReset={canReset}
      onFilters={onFilters}
      //
      results={dataFiltered.length}
    />
  );

  const denseHeight = dense ? 51 : 60;

  return (
    <Card sx={{ p: 0 }}>
      <Stack
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mt: { xs: 3, md: 2.5 }, mb: { xs: 1.5, md: 1 }, mx: 2.5 }}
      >
        <Stack spacing={2.5} sx={{ my: { xs: 1, md: 0 }, width: { xs: 1, md: 'auto' } }}>
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          alignSelf={{ xs: 'end', md: 'auto' }}
        >
          <IconButton size="small" onClick={() => handleClick('code')}>
            <Box
              component="img"
              src="/assets/icons/modules/ic_copilot.svg"
              sx={{ width: 26, height: 26, cursor: 'pointer' }}
            />
          </IconButton>

          <LoadingButton
            size="small"
            loading={startIndexing}
            disabled={notFound || selected.length === 0}
            variant={settings.themeMode === 'dark' ? 'soft' : 'contained'}
            color="primary"
            startIcon={<Iconify icon={flashFill} width={14} />}
            sx={{ px: 1.5, py: 2, mr: 0 }}
            onClick={handleIndex}
          >
            Index
          </LoadingButton>
        </Stack>
      </Stack>

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
                  <FileManagerTableRow
                    key={row.id}
                    kbId={kbId}
                    row={row}
                    dense={dense}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => onDeleteRow(row.id)}
                    onUpdateRow={onUpdateRow}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: 1,
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
            borderTop: notFound ? `dashed 1px ${theme.palette.divider}` : 'None',
          },
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete?"
        content={
          <>Your choices include indexed files. Could you confirm if you&apos;d like to re-index?</>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleStartIndexing();
              confirm.onFalse();
            }}
          >
            Confirm
          </Button>
        }
      />

      <FileManagerCopilot
        indexName={indexName}
        open={!!copilotTrigger}
        selectedKbs={selectedKbs}
        onClose={() => handleClick('')}
        callBack={() => {}}
      />
    </Card>
  );
}
