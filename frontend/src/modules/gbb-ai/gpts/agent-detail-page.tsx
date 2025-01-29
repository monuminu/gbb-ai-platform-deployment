import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CustomGptDetailsView } from './components/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: Agent</title>
      </Helmet>

      <CustomGptDetailsView id={`${id}`} />
    </>
  );
}
