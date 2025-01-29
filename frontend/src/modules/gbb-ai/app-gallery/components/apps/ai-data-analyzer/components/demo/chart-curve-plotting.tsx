import { ApexOptions } from 'apexcharts';

import Card, { CardProps } from '@mui/material/Card';

import { fShortenNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  selected?: boolean;
  onSelect?: VoidFunction;
  chart: {
    categories?: string[];
    colors?: string[];
    series: { name: string; data: number[] }[];
    options?: ApexOptions;
  };
}

export default function CurvePlottingChart({
  title,
  subheader,
  selected,
  onSelect,
  chart,
  ...other
}: Props) {
  const { categories, series, options } = chart;

  const chartOptions = useChart({
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => fShortenNumber(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fShortenNumber(value),
      },
    },
    ...options,
  });

  return (
    <Card
      {...other}
      sx={{
        mt: 1,
        mb: 0,
        px: 2,
        overflow: 'visible',
        boxShadow: 'none',
        // borderRadius: 0.75,
        // border: `${alpha(theme.palette.grey[500], 0.12)} 1px solid`,
        bgcolor: 'transparent',
        // bgcolor: `${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      <Chart
        dir="ltr"
        type="area"
        series={series}
        options={chartOptions}
        height={314}
        sx={{
          overflow: 'visible',
        }}
      />
    </Card>
  );
}
