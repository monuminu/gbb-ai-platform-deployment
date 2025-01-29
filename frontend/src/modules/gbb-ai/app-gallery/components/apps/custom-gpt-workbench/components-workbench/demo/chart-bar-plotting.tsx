import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      type: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function BarPlottingChart({ title, subheader, chart, ...other }: Props) {
  const { categories, colors, series, options } = chart;

  const theme = useTheme();

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('Total Sales');

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '48%',
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
    tooltip: {
      y: {
        formatter: (value: number) => `$${value}`,
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card
        {...other}
        sx={{
          mt: 3,
          mb: 2,
          width: '100%',
          boxShadow: 'none',
          borderRadius: 0.75,
          border: `${alpha(theme.palette.grey[500], 0.12)} 1px solid`,
          bgcolor: `${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        {series.map((item, index) => (
          <Box key={item.type} sx={{ mt: 3, mb: index === 0 ? -3 : -1, mx: 1.5 }}>
            {item.type === seriesData && (
              <Chart
                dir="ltr"
                type="bar"
                series={item.data}
                options={chartOptions}
                width="100%"
                height={324}
              />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
