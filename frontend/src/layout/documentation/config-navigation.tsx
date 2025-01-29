import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // ----------------------------------------------------------------------
      {
        subheader: t('Getting started'),
        items: [
          {
            title: t('Introduction'),
            path: paths.documentation.introduction,
          },
          {
            title: t('Setup to use'),
            path: paths.documentation.setupToUse,
          },
          {
            title: t('Deploy on Azure'),
            path: `${paths.documentation.root}/deploy-on-azure`,
          },
        ],
      },
      {
        subheader: t('Knowledge Bases (KB)'),
        items: [
          {
            title: t('Create a KB'),
            path: paths.documentation.kmm.create,
          },
          {
            title: t('Chat With KB'),
            path: paths.documentation.kmm.chat,
          },
        ],
      },
      {
        subheader: t('Function Module'),
        items: [
          {
            title: t('Preview'),
            path: paths.documentation.functions.preview,
          },
        ],
      },
      {
        subheader: t('Agent Store'),
        items: [
          {
            title: t('Create a custom GPT'),
            path: paths.documentation.gpts.create,
          },
          {
            title: t('Orchestrate Custom GPTs'),
            path: paths.documentation.gpts.orchestrate,
          },
        ],
      },
      {
        subheader: t('Applications'),
        items: [
          {
            title: t('AOAI Workbench'),
            path: paths.documentation.applications.aoaiWorkbench,
          },
          {
            title: t('TV Copilot'),
            path: paths.documentation.applications.tvCopilot,
          },
          {
            title: t('AI Data Analyzer'),
            path: paths.documentation.applications.chatDa,
          },
        ],
      },
      {
        subheader: t('About'),
        items: [
          {
            title: t('Author'),
            path: paths.documentation.author,
          },
          {
            title: t('Faqs'),
            path: paths.documentation.faqs,
          },
          {
            title: t('changelog'),
            path: paths.documentation.changeLog,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
