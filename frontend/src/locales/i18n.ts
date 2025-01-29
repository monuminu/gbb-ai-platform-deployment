import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { retrieveFromLocalStorage } from 'src/utils/local-storage';

import { defaultLang } from './config-lang';
import translationEn from './langs/en.json';
import translationCn from './langs/cn.json';
import translationJp from './langs/jp.json';

// ----------------------------------------------------------------------

const lng = retrieveFromLocalStorage('i18nextLng', defaultLang.value);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: translationEn },
      cn: { translations: translationCn },
      jp: { translations: translationJp },
    },
    lng,
    fallbackLng: lng,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
