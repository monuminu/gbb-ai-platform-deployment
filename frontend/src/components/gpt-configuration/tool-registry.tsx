import { useState, useEffect, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

// import { _allFunctions } from 'src/constants';
import { useFetchTools } from 'src/api/tool';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { SkeletonBoxTable } from 'src/components/skeleton';
import { useTable, getComparator } from 'src/components/table';

import { ITool, IToolFilters, IToolFilterType } from 'src/types/tool';

import ToolRegistryTable from './tool-registry-table';
import ToolRegistryFilters from './tool-registry-filters';
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

type Props = {
  selectedTools: string[] | undefined;
  onSelectTools: (tools: string[]) => void;
  layout?: string;
  searchText?: string;
};

// ----------------------------------------------------------------------

export default function ToolRegistry({ selectedTools, onSelectTools, layout, searchText }: Props) {
  const theme = useTheme();

  const [refreshKey, setRefreshKey] = useState(0);

  const table = useTable({
    defaultRowsPerPage: 5,
    defaultDense: true,
  });

  // const [tableData, setTableData] = useState(_allFunctions);
  // const tableData = _allFunctions;

  const { tools, refetch, toolsLoading, toolsEmpty, toolsRefetching } = useFetchTools();

  const showingSkeleton = toolsLoading || toolsRefetching;

  const [tableData, setTableData] = useState(tools);

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(searchText && { name: searchText }),
  });

  const allTags = Array.from(new Set(tools.map((func) => func.tags).flat()));

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !!filters.name || !!filters.tags.length;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IToolFilterType) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  useEffect(() => {
    handleFilters('name', searchText || '');
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    if (!showingSkeleton && !toolsEmpty) {
      setTableData(tools);
      const selected = selectedTools || [];
      table.setSelected(selected);
    }
    // eslint-disable-next-line
  }, [toolsEmpty, tools, showingSkeleton]);

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refetch, refreshKey]);

  const renderFilters = (
    <Stack spacing={2} direction="row" alignItems={{ xs: 'flex-end', md: 'center' }}>
      <ToolRegistryFilters filters={filters} onFilters={handleFilters} tagOptions={allTags} />
    </Stack>
  );

  const renderResults = (
    <ToolRegistryFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      canReset={canReset}
      onFilters={handleFilters}
      results={dataFiltered.length}
    />
  );

  return (
    <Card
      sx={{
        mb: 4,
        mx: 4.5,
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

      {showingSkeleton && SkeletonLoad}

      {!showingSkeleton && (
        <>
          {notFound ? (
            <EmptyContent
              filled
              title="No Data"
              sx={{ py: 2, m: 2, mt: -0.5, height: 274, borderRadius: 1 }}
            />
          ) : (
            <ToolRegistryTable
              table={table}
              tableData={tableData}
              dataFiltered={dataFiltered}
              notFound={notFound}
              onSelectTools={onSelectTools}
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
}: {
  inputData: ITool[];
  comparator: (a: any, b: any) => number;
  filters: IToolFilters;
}) {
  const { name, tags } = filters;

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
    inputData = inputData.filter((func) => func.tags?.some((tag) => tags.includes(tag)));
  }

  return inputData;
}
