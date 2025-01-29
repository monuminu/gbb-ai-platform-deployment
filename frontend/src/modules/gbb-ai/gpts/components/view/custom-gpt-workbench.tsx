import { Container } from '@mui/material';

import { useFetchApps } from 'src/api/app-gallery';
import { CustomGptsWorkbench } from 'src/modules/gbb-ai/app-gallery/components/apps';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function CustomGptWorkbenchPage() {
  const settings = useSettingsContext();
  const { apps } = useFetchApps();

  const customGpts = apps
    .filter((_app) => _app.source === 'custom')
    .map((_app) => ({
      ...(_app.content && JSON.parse(_app.content)),
      coverUrl: _app.cover,
      category: _app.category,
    }));

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <CustomGptsWorkbench
        id="gbbai-custom-gpt-workbench"
        customGpts={customGpts}
        clickSource="gpts"
      />
    </Container>
  );
}
