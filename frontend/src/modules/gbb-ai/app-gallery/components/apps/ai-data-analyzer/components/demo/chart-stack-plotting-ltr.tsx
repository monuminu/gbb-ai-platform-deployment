import { ApexOptions } from 'apexcharts';

import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories: string[];
    colors?: string[];
    series: { name: string; data: number[] }[];
    options?: ApexOptions;
  };
}

export default function StackPlottingChartLtr({ title, subheader, chart, ...other }: Props) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '36%',
      },
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}`,
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
        bgcolor: 'transparent',
      }}
    >
      <Chart
        dir="ltr"
        type="bar"
        series={series}
        options={chartOptions}
        width="100%"
        height={364}
      />
    </Card>
  );
}
