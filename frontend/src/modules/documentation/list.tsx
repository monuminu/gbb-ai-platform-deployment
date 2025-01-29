import { Helmet } from 'react-helmet-async';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { useParams } from 'src/routes/hooks';

import { useFetchContents } from 'src/api/documentation';

import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import getContents from './components/contents/catalog';

// ----------------------------------------------------------------------

// const mardownContent = `
// ### Author

// <br/>

// <br/>
// `;

// ----------------------------------------------------------------------

export default function DocumentationPage() {
  const params = useParams();

  const { section } = params;

  const theme = useTheme();

  const settings = useSettingsContext();

  const lightMode = theme.palette.mode === 'light';

  const currentSection = section || '';

  const sectionList = ['about-author', 'deploy-on-azure'];
  const isSectionInList = sectionList.includes(currentSection);

  const { webContent, isLoadingWeb } = useFetchContents(currentSection);
  const { localcontent, isLoadingLocal } = getContents(currentSection);

  const content = isSectionInList ? webContent : localcontent;
  const isLoading = isSectionInList ? isLoadingWeb : isLoadingLocal;

  // const content = mardownContent;
  // const isLoading = false;

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 12, my: 6, mx: -3 }} />;

  let maxWidthMode: 'xs' | 'md' | 'lg' | 'xl' = 'lg';
  let stretchMode: 'xs' | 'md' | 'lg' | 'xl' = 'xl';

  if (['introduction', 'about-author'].includes(currentSection)) {
    maxWidthMode = 'md';
    stretchMode = 'lg';
  }

  return (
    <>
      <Helmet>
        <title> GBB/AI: Documentation</title>
      </Helmet>

      <Container
        maxWidth={settings.themeStretch ? stretchMode : maxWidthMode}
        sx={{ mt: 1, mb: 1 }}
      >
        {isLoading && (
          <>
            <Skeleton height={260} variant="rectangular" sx={{ borderRadius: 2, my: 4 }} />
            <Stack spacing={3} sx={{ p: 0, my: 1 }}>
              {[...Array(8)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  sx={{ height: 28, borderRadius: 0.75 }}
                />
              ))}
            </Stack>
          </>
        )}
        {!isLoading && !!content && (
          <Markdown
            sx={{
              p: { mb: 20 },
              hr: { marginY: 3.5, borderStyle: 'dashed' },
              h3: { my: 2 },
              h4: { my: 2 },
              '& .component-image': { borderRadius: 0 },
              '& ul, & ol': { my: 3 },
              '& pre, pre > code': {
                fontSize: 13,
              },
              '& pre': {
                fontSize: 12,
                lineHeight: 1.5,
                position: 'relative',
                left: '6%',
                width: '88%',
                color: theme.palette.common.white,
                backgroundColor: lightMode ? theme.palette.grey[800] : theme.palette.grey[800],
              },
            }}
            children={content}
          />
        )}

        {!isLoading && !content && renderNotFound}
      </Container>
    </>
  );
}
