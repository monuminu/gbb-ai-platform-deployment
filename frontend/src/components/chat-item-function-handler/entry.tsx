import { fShortDate } from 'src/utils/format-time';

import SendEmailHandler from './send-email-handler';
import CurvePlottingChart from './chart-curve-plotting';
import FootballMatchHandler from './fototball-match-handler';
import ResturantOrderHandler from './resturant-order-handler';
import ResturantOrderOkHandler from './resturant-order-ok-handler';

// ----------------------------------------------------------------------

type Props = {
  function_calls: { funcName: string; results: any }[];
};

export default function ChatMessageItemFuncHandler({ function_calls }: Props) {
  if (!function_calls || function_calls.length === 0 || !function_calls[0].results) return null;

  const { funcName } = function_calls[0];

  if (funcName.includes('stock_data')) {
    try {
      const funcData = JSON.parse(function_calls[0].results.replace(/'/g, ''));
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
    } catch (error) {
      return null;
    }
  } else if (funcName === 'get_football_match_data') {
    return <FootballMatchHandler data={JSON.parse(function_calls[0].results)} />;
  } else if (funcName === 'get_resturant_list') {
    return <ResturantOrderHandler data={JSON.parse(function_calls[0].results)} />;
  } else if (funcName === 'send_emails') {
    return <SendEmailHandler data={JSON.parse(function_calls[0].results)} />;
  } else if (funcName === 'book_resturant') {
    return <ResturantOrderOkHandler data={JSON.parse(function_calls[0].results)} />;
  } else return null;
}
