import { fShortDate } from 'src/utils/format-time';

import BarPlottingChart from './demo/chart-bar-plotting';
import CurvePlottingChart from './demo/chart-curve-plotting';

// ----------------------------------------------------------------------

type Props = {
  function_calls: { funcName: string; results: any }[];
};

export default function ChatMessageItemFuncHandler({ function_calls }: Props) {
  if (!function_calls || function_calls.length === 0 || !function_calls[0].results) return null;

  const { funcName } = function_calls[0];

  if (funcName === 'get_stock_data') {
    const funcData = JSON.parse(function_calls[0].results);
    const keys = Object.keys(funcData);
    const mode = keys.includes('schema') ? 'curve' : '';
    if (mode === 'curve') {
      const chartTitle = funcData.title;
      const chartData = funcData.data;
      const dates = chartData.map((item: any) => fShortDate(item.Date));
      const open = chartData.map((item: any) => item.Open);
      const close = chartData.map((item: any) => item.Close);
      const low = chartData.map((item: any) => item.Low);
      const high = chartData.map((item: any) => item.High);
      const adjClose = chartData.map((item: any) => item['Adj Close']);

      return (
        <CurvePlottingChart
          title={chartTitle}
          subheader=""
          chart={{
            categories: dates,
            series: [
              { name: 'Open', data: open },
              { name: 'Close', data: close },
              { name: 'Low', data: low },
              { name: 'High', data: high },
              { name: 'Adj Close', data: adjClose },
            ],
          }}
        />
      );
    }
  } else if (funcName === 'get_sales_data') {
    const funcData = JSON.parse(function_calls[0].results);
    return <BarPlottingChart title="YoY Statistics" subheader="" chart={funcData} />;
  }
  return null;
}
