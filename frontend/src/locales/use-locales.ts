import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { retrieveFromLocalStorage } from 'src/utils/local-storage';

import { allLangs, defaultLang } from './config-lang';

// ----------------------------------------------------------------------

export function useLocales() {
  const langStorage = retrieveFromLocalStorage('i18nextLng');

  const currentLang = allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  return {
    allLangs,
    currentLang,
  };
}

// ----------------------------------------------------------------------

export function useTranslate() {
  const { t, i18n, ready } = useTranslation();

  const onChangeLang = useCallback(
    (newlang: string) => {
      i18n.changeLanguage(newlang);
    },
    [i18n]
  );

  return {
    t,
    i18n,
    ready,
    onChangeLang,
  };
}
