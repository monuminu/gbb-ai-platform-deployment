import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect, useCallback } from 'react';

// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

// project imports
import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { useFetchKmmList, deleteKnowledge } from 'src/api/kmm';

import EmptyContent from 'src/components/empty-content';
import { SkeletonBoxTable } from 'src/components/skeleton';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { IDataset, IDatasetFilters, RagSourceManager, IDatasetFilterValue } from 'src/types/kb';

import KbManagerTable from './kb-manager-table';
import FileManagerFilters from './kb-manager-filters';
import CreateKbDialog from './kb-manager-create-dialog';
import FileManagerCopilot from './kn-kb/file-manager-copilot';
import FileManagerFiltersResult from './kb-manager-filters-result';

// ----------------------------------------------------------------------

const SkeletonLoad = <SkeletonBoxTable rowNumber={5} sx={{ my: 3 }} />;

const defaultFilters: IDatasetFilters = {
  name: '',
  tags: [],
  status: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  refreshKey: number;
  onRefresh: () => void;
};

export default function KbManagerList({ refreshKey, onRefresh }: Props) {
  const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: 'modifiedAt' });

  const { enqueueSnackbar } = useSnackbar();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const { kmmList, isEmpty, isLoading } = useFetchKmmList(refreshKey);

  const [tableData, setTableData] = useState<IDataset[]>([]);

  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const [copilotTrigger, setCopilotTrigger] = useState('');

  const allTags = Array.from(new Set(kmmList.map((dataset) => dataset.tags).flat()));

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  useEffect(() => {
    if (!isLoading && !isEmpty) setTableData(kmmList);
  }, [isEmpty, kmmList, isLoading]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset =
    !!filters.name || !!filters.tags.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const selectedKbs: RagSourceManager[] = dataFiltered
    .filter((row) => table.selected.includes(row.id))
    .map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      index: row.index || '',
      status: 'Indexed',
    }));

  const selectedIndex = selectedKbs.length > 0 ? selectedKbs[0].index : '';

  const handleFilters = useCallback(
    (name: string, value: IDatasetFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const deleteRow = tableData.filter((row) => row.id === id)[0];

      try {
        setDeleting(true);
        const res = await deleteKnowledge(deleteRow.id, deleteRow.name);
        setDeleting(false);
        if (res && res.success) {
          table.setSelected([]);
          enqueueSnackbar('Deleted successfully');
          onRefresh();
          confirm.onFalse();
        } else if (res && !res.success) {
          enqueueSnackbar(res.message, { variant: 'error' });
        }
      } catch (error) {
        setDeleting(false);
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [table, confirm, onRefresh, tableData]
  );

  const handleDeleteItems = useCallback(async () => {
    const deleteRows = tableData.filter((row) => table.selected.includes(row.id));
    if (deleteRows.length === 0) return;

    setDeleting(true);
    Promise.all(deleteRows.map((row) => deleteKnowledge(row.id, row.index || '')))
      .then((results) => {
        setDeleting(false);
        const failedDeletions = results.filter((res) => !res || !res.success);
        if (failedDeletions.length === 0) {
          enqueueSnackbar('Deleted successfully');
          table.setSelected([]);
          confirm.onFalse();
          onRefresh();
        } else {
          failedDeletions.forEach((res) => {
            enqueueSnackbar(res.message, { variant: 'error' });
          });
        }
      })
      .catch((error) => {
        setDeleting(false);
        console.error(error);
        enqueueSnackbar('An error occurred while deleting', { variant: 'error' });
      });
    // eslint-disable-next-line
  }, [table, confirm, deleting, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hanldeOpenCopilot = useCallback(() => {
    const qaIncluded = selectedKbs.filter((kb) => kb.type.toLowerCase() === 'qa').length > 0;
    if (qaIncluded) {
      enqueueSnackbar('Only KB types are supported.', { variant: 'info' });
      return;
    }
    setCopilotTrigger('rag');
    // eslint-disable-next-line
  }, [selectedKbs]);

  const renderFilters = (
    <FileManagerFilters
      openDateRange={openDateRange.value}
      onCloseDateRange={openDateRange.onFalse}
      onOpenDateRange={openDateRange.onTrue}
      //
      filters={filters}
      onFilters={handleFilters}
      //
      dateError={dateError}
      tagOptions={allTags}
    />
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Card>
      <Stack spacing={2.5} sx={{ mt: { xs: 3, md: 2.5 }, mb: { xs: 1.5, md: 1 }, mx: 3 }}>
        <Stack
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column', md: 'row' }}
        >
          {renderFilters}

          <Stack
            direction="row"
            alignItems="center"
            alignSelf="end"
            spacing={2}
            sx={{ mt: { xs: 0.5, md: 0 }, mb: { md: 0.1 } }}
          >
            <IconButton size="small" onClick={hanldeOpenCopilot}>
              <Box
                component="img"
                src="/assets/icons/modules/ic_copilot.svg"
                sx={{ width: 26, height: 26, cursor: 'pointer' }}
              />
            </IconButton>
            <LoadingButton
              size="small"
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={upload.onTrue}
              sx={{ px: 1 }}
            >
              Knowledge
            </LoadingButton>
          </Stack>
        </Stack>

        {canReset && renderResults}
      </Stack>

      {isLoading && SkeletonLoad}

      {!isLoading && (
        <>
          {notFound ? (
            <EmptyContent filled title="No Data" sx={{ py: 10, m: 3, borderRadius: 1 }} />
          ) : (
            <KbManagerTable
              table={table}
              tableData={tableData}
              dataFiltered={dataFiltered}
              onDeleteRow={handleDeleteItem}
              notFound={notFound}
              onOpenConfirm={confirm.onTrue}
            />
          )}
        </>
      )}

      <FileManagerCopilot
        indexName={selectedIndex}
        open={!!copilotTrigger}
        selectedKbs={selectedKbs}
        onClose={() => setCopilotTrigger('')}
        callBack={() => {}}
      />

      <CreateKbDialog open={upload.value} onClose={upload.onFalse} onRefresh={onRefresh} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete?"
        content={
          <>
            Are you sure to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <LoadingButton
            loading={deleting}
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
            }}
          >
            Delete
          </LoadingButton>
        }
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IDataset[];
  comparator: (a: any, b: any) => number;
  filters: IDatasetFilters;
  dateError: boolean;
}) {
  const { name, tags, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (tags.length) {
    inputData = inputData.filter((file) => file.tags?.some((tag) => tags.includes(tag)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (file) =>
          fTimestamp(file.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(file.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
