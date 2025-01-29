import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: { name: string; data: number[] }[];
    options?: ApexOptions;
  };
}

export default function CurvePlottingChart({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();
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
        mt: 3,
        mb: 2,
        boxShadow: 'none',
        borderRadius: 0.75,
        border: `${alpha(theme.palette.grey[500], 0.12)} 1px solid`,
        bgcolor: `${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      <CardHeader title={title} />

      <Box sx={{ mt: 3, mx: 1.5 }}>
        <Chart dir="ltr" type="area" series={series} options={chartOptions} height={294} />
      </Box>
    </Card>
  );
}
