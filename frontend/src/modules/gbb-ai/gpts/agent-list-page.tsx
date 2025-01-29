import { Helmet } from 'react-helmet-async';

import { CustomGptListView } from './components/view';

// ----------------------------------------------------------------------

export default function AppGalleryPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: Agent store</title>
      </Helmet>

      <CustomGptListView />
    </>
  );
}
