import Box from '@mui/material/Box';

import BarPlottingChart from './demo/chart-bar-plotting';
import PiePlottingChart from './demo/chart-pie-plotting';
import StackPlottingChart from './demo/chart-stack-plotting';
import CurvePlottingChart from './demo/chart-curve-plotting';
import DonutPlottingChart from './demo/chart-donut-plotting';
import StackPlottingChartLtr from './demo/chart-stack-plotting-ltr';
import BarVerticalPlottingChart from './demo/chart-bar-vertical-plotting';

// ----------------------------------------------------------------------

type Props = {
  data: any;
  chartType: string;
};

export default function DataVisualizationHandler({ data, chartType }: Props) {
  if (!data || Object.keys(data).length === 0) return null;

  try {
    const keys = Object.keys(data);
    const items = keys.map((key) => {
      const values = Object.values(data[key]);
      if (values.every((value) => typeof value === 'string')) {
        return values as string[];
      }
      if (values.every((value) => typeof value === 'number')) {
        return values as number[];
      }
      throw new Error(`Unexpected data type in key ${key}`);
    }) as any[];

    // console.log(keys);
    // console.log(items);

    if (keys.length < 2) {
      return (
        <Box sx={{ p: 2, py: 1 }}>
          <Box
            sx={{
              py: 1.5,
              typography: 'body1',
              wordBreak: 'break-word',
              fontSize: '15px',
              whiteSpace: 'pre-line',
            }}
          >
            {JSON.stringify(data, null, 2)}
          </Box>
        </Box>
      );
    }

    if (chartType.toLowerCase() === 'stack') {
      return (
        <StackPlottingChart
          title=""
          subheader=""
          chart={{
            categories: items[0],
            series: keys.slice(1).map((key, index) => ({
              name: key,
              data: items[index + 1],
            })),
          }}
        />
      );
    }

    if (chartType.toLowerCase() === 'stack (ltr)') {
      return (
        <StackPlottingChartLtr
          title=""
          subheader=""
          chart={{
            categories: items[0],
            series: keys.slice(1).map((key, index) => ({
              name: key,
              data: items[index + 1],
            })),
          }}
        />
      );
    }

    if (chartType.toLowerCase() === 'bar') {
      return (
        <BarPlottingChart
          title=""
          subheader=""
          chart={{
            categories: items[0],
            series: keys.slice(1).map((key, index) => ({
              name: key,
              data: items[index + 1],
            })),
          }}
        />
      );
    }

    if (chartType.toLowerCase() === 'bar (ltr)') {
      return (
        <BarVerticalPlottingChart
          title=""
          subheader=""
          chart={{
            categories: items[0],
            series: keys.slice(1).map((key, index) => ({
              name: key,
              data: items[index + 1],
            })),
          }}
        />
      );
    }

    if (chartType.toLowerCase() === 'pie') {
      return (
        <PiePlottingChart
          title={keys[1]}
          subheader=""
          chart={{
            series: items[0].map((item: any, index: number) => ({
              label: item,
              value: items[1][index],
            })),
          }}
        />
      );
    }

    if (chartType.toLowerCase() === 'donut') {
      return (
        <DonutPlottingChart
          title={keys[1]}
          subheader=""
          chart={{
            series: items[0].map((item: any, index: number) => ({
              label: item,
              value: items[1][index],
            })),
          }}
        />
      );
    }

    return (
      <CurvePlottingChart
        title=""
        subheader=""
        chart={{
          categories: items[0],
          series: keys.slice(1).map((key, index) => ({
            name: key,
            data: items[index + 1],
          })),
        }}
      />
    );
  } catch (error) {
    console.log('error');
    return (
      <Box sx={{ p: 2, py: 1 }}>
        <Box
          sx={{
            py: 1.5,
            typography: 'body1',
            wordBreak: 'break-word',
            fontSize: '15px',
            whiteSpace: 'pre-line',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </Box>
      </Box>
    );
  }

  // if (funcName === 'get_stock_data') {
  //   const funcData = JSON.parse(function_calls[0].results);
  //   const keys = Object.keys(funcData);
  //   const mode = keys.includes('schema') ? 'curve' : '';
  //   if (mode === 'curve') {
  //     const chartTitle = funcData.title;
  //     const chartData = funcData.data;
  //     const dates = chartData.map((item: any) => fShortDate(item.Date));
  //     const open = chartData.map((item: any) => item.Open);
  //     const close = chartData.map((item: any) => item.Close);
  //     const low = chartData.map((item: any) => item.Low);
  //     const high = chartData.map((item: any) => item.High);
  //     const adjClose = chartData.map((item: any) => item['Adj Close']);

  //     return (
  //       <CurvePlottingChart
  //         title={chartTitle}
  //         subheader=""
  //         chart={{
  //           categories: dates,
  //           series: [
  //             { name: 'Open', data: open },
  //             { name: 'Close', data: close },
  //             { name: 'Low', data: low },
  //             { name: 'High', data: high },
  //             { name: 'Adj Close', data: adjClose },
  //           ],
  //         }}
  //       />
  //     );
  //   }
  // } else if (funcName === 'get_sales_data') {
  //   const funcData = JSON.parse(function_calls[0].results);
  //   return <BarPlottingChart title="YoY Statistics" subheader="" chart={funcData} />;
  // }
  return null;
}
