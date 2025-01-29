import { Helmet } from 'react-helmet-async';

import { CustomGptWorkbench } from './components/view';

// ----------------------------------------------------------------------

export default function CustomGptWorkbenchPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: Agent Workbench</title>
      </Helmet>

      <CustomGptWorkbench />
    </>
  );
}
