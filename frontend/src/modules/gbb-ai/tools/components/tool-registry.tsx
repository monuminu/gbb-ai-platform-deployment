import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect, useCallback } from 'react';

// mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

// project imports
import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { TOOL_STATUS_OPTIONS } from 'src/constants';
import { deleteTool, useFetchTools } from 'src/api/tool';

import EmptyContent from 'src/components/empty-content';
import { SkeletonBoxTable } from 'src/components/skeleton';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { ITool, IToolFilters, IToolFilterType } from 'src/types/tool';

import ToolRegistryTable from './tool-registry-table';
import ToolRegistryFilters from './tool-registry-filters';
import CreateToolDialog from './tool-registry-create-dialog';
import ToolRegistryFiltersResult from './tool-registry-filters-result';

// ----------------------------------------------------------------------

const SkeletonLoad = <SkeletonBoxTable rowNumber={5} sx={{ mb: 3 }} />;

const defaultFilters: IToolFilters = {
  name: '',
  tags: [],
  statuses: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  refreshKey: number;
};

export default function ToolRegistry({ refreshKey }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const create = useBoolean();
  const confirm = useBoolean();
  const openDateRange = useBoolean();

  const { tools, refetch, toolsLoading, toolsEmpty, toolsRefetching } = useFetchTools();

  const showingSkeleton = toolsLoading || toolsRefetching;

  const [deleting, setDeleting] = useState(false);

  const [tableData, setTableData] = useState(tools);

  const [filters, setFilters] = useState(defaultFilters);

  const allTags = Array.from(new Set(tools.map((func) => func.tags).flat()));

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset =
    !!filters.name ||
    !!filters.tags.length ||
    !!filters.statuses.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  useEffect(() => {
    if (!showingSkeleton && !toolsEmpty) setTableData(tools);
  }, [toolsEmpty, tools, showingSkeleton]);

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refetch, refreshKey]);

  const handleFilters = useCallback(
    (name: string, value: IToolFilterType) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteItems = useCallback(async () => {
    const deleteRows = tableData.filter((row) => table.selected.includes(row.id));
    if (deleteRows.length === 0) return;

    setDeleting(true);
    Promise.all(deleteRows.map((row) => deleteTool(row.id)))
      .then((results) => {
        setDeleting(false);
        const failedDeletions = results.filter((res) => !res || !res.success);
        if (failedDeletions.length === 0) {
          enqueueSnackbar('Deleted successfully');
          table.setSelected([]);
          confirm.onFalse();
          refetch();
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

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const deleteRow = tableData.filter((row) => row.id === id)[0];

      try {
        setDeleting(true);
        const res = await deleteTool(deleteRow.id);
        setDeleting(false);
        if (res && res.success) {
          table.setSelected([]);
          enqueueSnackbar('Deleted successfully');
          refetch();
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
    [table, confirm, tableData]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <ToolRegistryFilters
      openDateRange={openDateRange.value}
      onCloseDateRange={openDateRange.onFalse}
      onOpenDateRange={openDateRange.onTrue}
      filters={filters}
      onFilters={handleFilters}
      dateError={dateError}
      statusOptions={TOOL_STATUS_OPTIONS}
      tagOptions={allTags}
    />
  );

  const renderResults = (
    <ToolRegistryFiltersResult
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
      <Stack spacing={2.5} sx={{ mt: { xs: 3, md: 2.5 }, mb: { xs: 3, md: 3 }, mx: 3 }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column', md: 'row' }}
        >
          {renderFilters}

          <Button
            size="small"
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={create.onTrue}
            sx={{ px: 1, mt: { xs: 1.75, md: 0 }, alignSelf: { xs: 'end', md: 'auto' } }}
          >
            Tool
          </Button>
        </Stack>

        {canReset && renderResults}
      </Stack>

      {showingSkeleton && SkeletonLoad}

      {!showingSkeleton && (
        <>
          {notFound ? (
            <EmptyContent filled title="No Data" sx={{ py: 8, m: 3 }} />
          ) : (
            <ToolRegistryTable
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

      <CreateToolDialog open={create.value} onClose={create.onFalse} />

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
            variant="contained"
            loading={deleting}
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
  inputData: ITool[];
  comparator: (a: any, b: any) => number;
  filters: IToolFilters;
  dateError: boolean;
}) {
  const { name, tags, statuses, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (func) => func.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (tags.length) {
    inputData = inputData.filter((func) => func.tags?.some((tag) => tags.includes(tag)));
  }

  if (statuses.length) {
    inputData = inputData.filter((func) => statuses.includes(func.status.toLowerCase()));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (func) =>
          fTimestamp(func.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(func.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
