import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  gpts: icon('ic_gpts'),
  users: icon('ic_users'),
  datahub: icon('ic_datahub'),
  function: icon('ic_function'),
  pipeline: icon('ic_pipeline'),
  dashboard: icon('ic_dashboard'),
  evaluation: icon('ic_evaluation'),
  application: icon('ic_applications'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // MAIN FEATURES
      // ----------------------------------------------------------------------
      {
        subheader: t('main'),
        items: [
          // {
          //   title: t('tracing'),
          //   path: paths.gbbai.tracing.root,
          //   icon: ICONS.dashboard,
          // },
          {
            title: t('tools'),
            path: paths.gbbai.function.root,
            icon: ICONS.function,
          },
          {
            title: t('knowledge'),
            path: paths.gbbai.kb.root,
            icon: ICONS.datahub,
          },
          // {
          //   title: t('workflow'),
          //   path: paths.maintenance,
          //   icon: ICONS.pipeline,
          // },
          // {
          //   title: t('evaluation'),
          //   path: paths.gbbai.benchmark.root,
          //   icon: ICONS.evaluation,
          // },
          {
            title: t('agent_store'),
            path: paths.gbbai.gpts.root,
            icon: ICONS.gpts,
          },
          {
            title: t('applications'),
            path: paths.gbbai.appGallery.root,
            icon: ICONS.application,
          },
        ],
      },

      // CREDNETIALS
      // ----------------------------------------------------------------------
      {
        subheader: t('crednetials'),
        items: [
          {
            title: t('user'),
            path: paths.gbbai.user.root,
            icon: ICONS.users,
            children: [{ title: t('account'), path: paths.gbbai.user.account }],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
