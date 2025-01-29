import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';

import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';
import { fTimestamp } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { getPhotoBase64Data } from 'src/api/user';
import { uploadSource, useFetchKbItems } from 'src/api/kmm';

import { fileFormat } from 'src/components/file-thumbnail';
import { SkeletonChartTable } from 'src/components/skeleton';
import { useTable, getComparator } from 'src/components/table';

import { IDataset, KbItemManager, IKbTableFilters, IDatasetFilterValue } from 'src/types/kb';

import KbUploadDialog from '../kb-upload-dialog';
import FileManagerTable from './file-manager-table';

// ----------------------------------------------------------------------

const defaultFilters: IKbTableFilters = {
  name: '',
  types: [],
  statuses: [],
  startDate: null,
  endDate: null,
};

const SkeletonLoad = (
  <Grid container>
    <Grid item xs={12}>
      <SkeletonChartTable rowNumber={8} />
    </Grid>
  </Grid>
);

// ----------------------------------------------------------------------

type Props = {
  kbMeta: IDataset;
  refreshKey: number;
  openUpload: boolean;
  onCloseUpload: () => void;
};

export default function KbManagerRoot({ kbMeta, refreshKey, openUpload, onCloseUpload }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const table = useTable({
    defaultOrder: 'desc',
    defaultRowsPerPage: 10,
    defaultOrderBy: 'modifiedAt',
  });

  const confirm = useBoolean();

  const { kbItems, isLoading } = useFetchKbItems(kbMeta.id, refreshKey);

  const [tableData, setTableData] = useState<KbItemManager[]>([]);

  useEffect(() => {
    if (!isLoading) setTableData(kbItems);
  }, [kbItems, isLoading]);

  const [filters, setFilters] = useState(defaultFilters);

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

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const notFound = !dataFiltered.length || !dataFiltered.length;

  const canReset =
    !!filters.name ||
    !!filters.types.length ||
    !!filters.statuses.length ||
    (!!filters.startDate && !!filters.endDate);

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

  const handleAddTempRow = useCallback(
    (newRow: KbItemManager, mode?: string) => {
      if (mode === 'replace') {
        setTableData((prevState) =>
          prevState.map((oldRow) => {
            if (newRow.id === oldRow.id) return newRow;
            return oldRow;
          })
        );
        return;
      }
      setTableData((prevState) => [newRow, ...prevState]);
    },
    [setTableData]
  );

  const handleUpdateRow = useCallback(
    (newRow: KbItemManager) => {
      setTableData((prevState) =>
        prevState.map((oldRow) => {
          if (newRow.id === oldRow.id) {
            return newRow;
          }
          return oldRow;
        })
      );
    },
    [setTableData]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      setTableData((prevState) => prevState.filter((row) => row.id !== id));
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  // const handleDeleteItems = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRows: tableData.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleUpload = async (files: File[]) => {
    const photoBase64DataRes = await getPhotoBase64Data(user?.photoURL);

    files.forEach((file, _) => {
      const fileId = uuidv4();
      const formData = new FormData();
      formData.append('file', file);

      const maintainers = [
        {
          id: '1',
          name: user?.displayName || 'Anonymous',
          email: user?.username || 'Anonymous',
          photo: photoBase64DataRes || '',
          permission: 'edit',
          avatarUrl: photoBase64DataRes ? '' : '/assets/avatars/avatar_1.jpg',
        },
      ];

      const additionalData = {
        fileName: file.name,
        id: fileId,
        size: file.size,
        shared: maintainers,
      };

      const _row = {
        id: fileId,
        name: file.name,
        storage: { account: '', container: '' },
        url: '',
        createdAt: new Date(),
        modifiedAt: new Date(),
        type: file.name.split('.').pop() || '',
        status: 'Uploading...',
        size: file.size,
        chunks: 0,
        tags: [],
        shared: maintainers,
        isFavorited: false,
      };

      const jsonAdditionalData = JSON.stringify(additionalData); // Convert it to JSON
      formData.append('additionalData', jsonAdditionalData);

      handleAddTempRow(_row);

      uploadSource(kbMeta.id, formData)
        .then((res) => {
          if (res && res.success) {
            handleAddTempRow(res.item, 'replace');
          } else {
            handleDeleteItem(fileId);
            enqueueSnackbar(res.message, { variant: 'error' });
          }
        })
        .catch((error) => {
          handleDeleteItem(fileId);
          enqueueSnackbar(error, { variant: 'error' });
          console.error('An error occurred while uploading the file:', error);
        });
    });
  };

  return (
    <>
      {isLoading && SkeletonLoad}
      {!isLoading && (
        <FileManagerTable
          kbId={kbMeta.id}
          indexName={kbMeta.index ? kbMeta.index : ''}
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          onDeleteRow={handleDeleteItem}
          notFound={notFound}
          filters={filters}
          dateError={dateError}
          canReset={canReset}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          onOpenConfirm={confirm.onTrue}
          onUpdateRow={handleUpdateRow}
        />
      )}

      <KbUploadDialog
        kbId={kbMeta.id}
        onUpload={handleUpload}
        open={openUpload}
        onClose={onCloseUpload}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: KbItemManager[];
  comparator: (a: any, b: any) => number;
  filters: IKbTableFilters;
  dateError: boolean;
}) {
  const { name, types, statuses, startDate, endDate } = filters;

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

  if (types.length) {
    inputData = inputData.filter((file) => types.includes(fileFormat(file.type)));
  }

  if (statuses.length) {
    inputData = inputData.filter((file) => statuses.includes(file.status));
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
