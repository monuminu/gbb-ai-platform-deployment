// mui
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

// project import
import TesterRequestPython from './tool-detail-tabs-test-request-python';
import TesterRequestOpenAPI from './tool-detail-tabs-test-request-openapi';

// ----------------------------------------------------------------------

type Props = {
  codeType: string;
  entryFunction: string;
  params: { name: string; type: string; value: string }[];
  onUpdateParams: (index: number, data: string) => void;
  onSetLoadingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateResponse: (data: string) => void;
  apiAuth?: { type: string; apiKey: string; authType: string } | null;
};

export default function TesterRequest({
  codeType,
  entryFunction,
  params,
  onUpdateParams,
  onSetLoadingResponse,
  onUpdateResponse,
  apiAuth,
}: Props) {
  return (
    <Card sx={{ height: 'calc(100% - 16px)' }}>
      <CardHeader title="Request" sx={{ mt: -1, mb: -0.5 }} />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

      {codeType === 'Python' && (
        <TesterRequestPython
          entryFunction={entryFunction}
          params={params}
          onUpdateParams={onUpdateParams}
          onUpdateResponse={onUpdateResponse}
          onSetLoadingResponse={onSetLoadingResponse}
        />
      )}

      {codeType === 'OpenAPI' && (
        <TesterRequestOpenAPI
          params={params}
          apiAuth={apiAuth || null}
          onUpdateParams={onUpdateParams}
          onUpdateResponse={onUpdateResponse}
          onSetLoadingResponse={onSetLoadingResponse}
        />
      )}
    </Card>
  );
}
