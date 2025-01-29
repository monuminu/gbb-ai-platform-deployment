import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import fileImport from '@iconify/icons-mdi/file-import';
import downloadFill from '@iconify/icons-eva/download-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import EmptyContent from 'src/components/empty-content';

import { IAoaiResourceItem } from 'src/types/azure-resource';

import { AoaiResourceItem, AoaiResourceForm } from './aoai';

// ----------------------------------------------------------------------

type Props = {
  aoaiResources: IAoaiResourceItem[];
  onAddNewAoaiResource?: (resource: IAoaiResourceItem) => void;
  onUpdateAoaiResource?: (oldName: string, resource: IAoaiResourceItem) => void;
  onDeleteAoaiResource?: (oldName: string) => void;
  onDownloadAoaiResource: () => void;
  onUploadAoaiResource: () => void;
  onSetPrimaryAoaiResource: (resourceName: string) => void;
};

export default function AccountAoaiResources({
  aoaiResources,
  onAddNewAoaiResource,
  onUpdateAoaiResource,
  onDeleteAoaiResource,
  onDownloadAoaiResource,
  onUploadAoaiResource,
  onSetPrimaryAoaiResource,
}: Props) {
  const aoaiResourceForm = useBoolean();

  return (
    <>
      <Card>
        <CardHeader
          title="Resources"
          sx={{ pt: 2.75, px: 2.5 }}
          action={
            <Stack direction="row" spacing={1} sx={{ mr: 1, mt: 0.25 }}>
              <Button
                size="small"
                variant="soft"
                color="primary"
                startIcon={<Icon icon={plusFill} />}
                onClick={aoaiResourceForm.onTrue}
              >
                Resource
              </Button>
              <Button
                size="small"
                variant="soft"
                color="success"
                startIcon={<Icon icon={fileImport} />}
                onClick={onUploadAoaiResource}
              >
                Import
              </Button>
            </Stack>
          }
        />

        {aoaiResources.length === 0 && (
          <Stack spacing={2.5} sx={{ p: 3 }}>
            <EmptyContent filled title="No resources" sx={{ py: 10 }} />
          </Stack>
        )}

        {Array.isArray(aoaiResources) && aoaiResources.length > 0 && (
          <Stack spacing={2.5} sx={{ p: 2.5 }}>
            {aoaiResources.map((item, index) => (
              <AoaiResourceItem
                variant="outlined"
                key={index}
                aoaiResource={item}
                onUpdateAoaiResource={onUpdateAoaiResource}
                onDeleteAoaiResource={onDeleteAoaiResource}
                onSetPrimaryAoaiResource={onSetPrimaryAoaiResource}
                sx={{ p: 2, borderRadius: 1 }}
              />
            ))}
            <Button
              size="small"
              color="inherit"
              type="submit"
              variant="contained"
              startIcon={<Icon icon={downloadFill} />}
              sx={{ width: 110 }}
              onClick={onDownloadAoaiResource}
            >
              Download
            </Button>
          </Stack>
        )}
      </Card>

      <AoaiResourceForm
        open={aoaiResourceForm.value}
        onClose={aoaiResourceForm.onFalse}
        onCreate={onAddNewAoaiResource}
      />
    </>
  );
}
