import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useLocales } from './use-locales';

// ----------------------------------------------------------------------

type LocaleProviderProps = {
  children: React.ReactNode;
};

const LocaleProvider: React.FC<LocaleProviderProps> = ({children}: LocaleProviderProps) => {
  const { currentLang } = useLocales();

  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLang.adapterLocale}>
      {children}
    </MuiLocalizationProvider>
  );
}

export default LocaleProvider;