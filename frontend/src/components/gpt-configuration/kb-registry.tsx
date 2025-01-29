import { useState, useEffect, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { useFetchKmmList } from 'src/api/kmm';
import { FILE_TYPE_OPTIONS } from 'src/constants';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { SkeletonBoxTable } from 'src/components/skeleton';
import { fileFormat } from 'src/components/file-thumbnail';
import { useTable, getComparator } from 'src/components/table';

import { IDataset, IDatasetFilters, IDatasetFilterValue } from 'src/types/kb';

import KbRegistryTable from './kb-registry-table';
import KbRegistryFilters from './kb-registry-filters';
import KbRegistryFiltersResult from './kb-registry-filters-result';

// ----------------------------------------------------------------------

const SkeletonLoad = <SkeletonBoxTable rowNumber={5} sx={{ mb: 3 }} />;

const defaultFilters: IDatasetFilters = {
  name: '',
  tags: [],
  status: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  selectedIndex: string | undefined;
  onSelectIndex: (index: string) => void;
  layout?: string;
  searchText?: string;
};

// ----------------------------------------------------------------------

export default function KbRegistry({ selectedIndex, onSelectIndex, layout, searchText }: Props) {
  const theme = useTheme();

  const [refreshKey, setRefreshKey] = useState(0);

  const openDateRange = useBoolean();

  const [tableData, setTableData] = useState<IDataset[]>([]);

  const { kmmList, isLoading, isEmpty } = useFetchKmmList(refreshKey);

  const table = useTable({
    defaultRowsPerPage: 5,
    defaultDense: true,
  });

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(searchText && { name: searchText }),
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

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

  useEffect(() => {
    handleFilters('name', searchText || '');
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    if (!isLoading && !isEmpty) {
      setTableData(kmmList);
      const selected = kmmList
        ? kmmList.filter((row) => row.index === selectedIndex).map((row) => row.id)
        : [];
      table.setSelected(selected);
    }
    // eslint-disable-next-line
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

  const handleRefresh = () => {
    setRefreshKey(Math.floor(Math.random() * 1000));
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack spacing={2} direction="row" alignItems="center">
      <KbRegistryFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <KbRegistryFiltersResult
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
    <Card
      sx={{
        p: 0,
        mx: 4.5,
        mb: 4,
        height: '100%',
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: `${theme.palette.background.neutral}`,
        ...(layout && { m: 0, backgroundColor: 'transparent' }),
      }}
    >
      <Stack spacing={2.5} sx={{ mt: { xs: 2, md: 2 }, mb: { xs: 2, md: 2 }, mx: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderFilters}

          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ width: 32, height: 32, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
        </Stack>

        {canReset && renderResults}
      </Stack>
      {isLoading && SkeletonLoad}
      {!isLoading && (
        <>
          {notFound ? (
            <EmptyContent
              filled
              title="No Data"
              sx={{ py: 2, m: 2, mt: -0.5, height: 324, borderRadius: 1 }}
            />
          ) : (
            <KbRegistryTable
              table={table}
              tableData={tableData}
              dataFiltered={dataFiltered}
              notFound={notFound}
              onRefresh={handleRefresh}
              onSelectIndex={onSelectIndex}
            />
          )}
        </>
      )}
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
    inputData = inputData.filter((file) => tags.includes(fileFormat(file.type)));
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
