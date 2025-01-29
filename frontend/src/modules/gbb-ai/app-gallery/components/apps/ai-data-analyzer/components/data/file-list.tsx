import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomFile } from 'src/components/upload';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { IFile, IFileFilters, IFileFilterValue } from 'src/types/file';

import FileListTable from './file-list-table';
import FileListFilters from './file-list-filters';
import FileListFiltersResult from './file-list-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  dataFiles: CustomFile[];
  onSetselectedFiles: (fileNames: string[]) => void;
};

export default function FileList({ dataFiles, onSetselectedFiles }: Props) {
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([] as IFile[]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  useEffect(() => {
    const updatedTableData = dataFiles.map((file) => ({
      id: file.path,
      name: file.path,
      size: file.size,
      type: file.path?.split('.').pop() || 'unknown',
    })) as IFile[];

    setTableData(updatedTableData);
  }, [dataFiles]);

  useEffect(() => {
    onSetselectedFiles(table.selected);
  }, [table.selected, onSetselectedFiles]);

  const handleFilters = useCallback(
    (name: string, value: IFileFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileListFilters filters={filters} onFilters={handleFilters} />
    </Stack>
  );

  const renderResults = (
    <FileListFiltersResult
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
    <>
      <Box sx={{ px: 2.5 }}>
        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 2 } }}>
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{ py: 10 }}
            imgUrl="/assets/icons/empty/ic_data.svg"
          />
        ) : (
          <FileListTable
            table={table}
            tableData={tableData}
            dataFiltered={dataFiltered}
            onDeleteRow={handleDeleteItem}
            notFound={notFound}
          />
        )}
      </Box>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IFile[];
  comparator: (a: any, b: any) => number;
  filters: IFileFilters;
}) {
  const { name } = filters;

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

  return inputData;
}
