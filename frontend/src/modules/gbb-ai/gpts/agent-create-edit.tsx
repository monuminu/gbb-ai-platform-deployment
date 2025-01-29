import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CustomeGptCreateEditView } from './components/view';

// ----------------------------------------------------------------------

export default function CustomGptCreateEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: Edit Agent</title>
      </Helmet>

      <CustomeGptCreateEditView id={id} />
    </>
  );
}
