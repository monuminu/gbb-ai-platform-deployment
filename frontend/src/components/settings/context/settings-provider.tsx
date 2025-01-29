import { useMemo } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

const SETTINGS_STORAGE_KEY = 'gbbai-settings';

const initialSettings = {
  themeMode: 'light',
  themeLayout: 'vertical',
  themeColorPresets: 'default',
  themeStretch: false,
};

interface ProviderProps {
  children: React.ReactNode;
}

export const SettingsContextProvider = ({ children }: ProviderProps) => {
  const { state: settingsState, update: updateSettings } = useLocalStorage(
    SETTINGS_STORAGE_KEY,
    initialSettings
  );

  const contextValue = useMemo(
    () => ({
      ...settingsState,
      onUpdate: updateSettings,
    }),
    [updateSettings, settingsState]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};
