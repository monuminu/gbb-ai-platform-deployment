import { merge } from 'lodash';
import { ja as jaJPAdapter, enUS as enUSAdapter, zhCN as zhCNAdapter } from 'date-fns/locale';

import { enUS as enUSCore, jaJP as jaJPCore, zhCN as zhCNCore } from '@mui/material/locale';
import { enUS as enUSDate, jaJP as jaJPDate, zhCN as zhCNDate } from '@mui/x-date-pickers/locales';
import { enUS as enUSDataGrid, jaJP as jaJPDataGrid, zhCN as zhCNDataGrid } from '@mui/x-data-grid';


const languages = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  {
    label: '中文',
    value: 'cn',
    systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
    adapterLocale: zhCNAdapter,
    icon: 'flagpack:cn',
  },
  {
    label: '日本語',
    value: 'jp',
    systemValue: merge(jaJPDate, jaJPDataGrid, jaJPCore),
    adapterLocale: jaJPAdapter,
    icon: 'flagpack:jp',
  },
];

const defaultLanguage = languages[0];

export { languages as allLangs, defaultLanguage as defaultLang };