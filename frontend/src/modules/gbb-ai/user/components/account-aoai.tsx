import { useSnackbar } from 'notistack';
import { useRef, useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { getStorage, setStorage, AOAI_CREDENTIAL_KEY } from 'src/hooks/use-local-storage';

import { IAoaiResourceItem } from 'src/types/azure-resource';

import AccountAoaiResources from './account-aoai-resources';

// ----------------------------------------------------------------------

export default function AccountAoai() {
  const { enqueueSnackbar } = useSnackbar();
  const resources = getStorage(AOAI_CREDENTIAL_KEY);
  const fileRef = useRef<HTMLInputElement>(null);
  const [aoaiResources, setAoaiResources] = useState<IAoaiResourceItem[]>(resources || []);

  const handleAddNewAoaiResource = useCallback(
    (resource: IAoaiResourceItem) => {
      if (setStorage(AOAI_CREDENTIAL_KEY, [...aoaiResources, resource])) {
        setAoaiResources((prev) => [...prev, resource]);
        enqueueSnackbar('Added successfully');
      } else {
        enqueueSnackbar(`Failed to add resource`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [aoaiResources]
  );

  const handleRemoveAoaiResource = useCallback(
    (oldName: string) => {
      if (!oldName || oldName.length === 0) return;
      const existedResourceIndex = aoaiResources.findIndex((item) => item.resourceName === oldName);

      if (existedResourceIndex === -1) return;

      const newArr = aoaiResources.filter((item) => item.resourceName !== oldName);
      if (aoaiResources[existedResourceIndex].primary && newArr.length > 0) {
        newArr[0].primary = true;
      }
      if (setStorage(AOAI_CREDENTIAL_KEY, newArr)) {
        setAoaiResources(newArr);
        enqueueSnackbar('Deleted successfully');
      } else {
        enqueueSnackbar(`Failed to delte resource`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [aoaiResources]
  );

  const handleUpdateAoaiResource = useCallback(
    (oldName: string, resource: IAoaiResourceItem) => {
      if (!oldName || oldName.length === 0) return;
      const existedResourceIndex = aoaiResources.findIndex((item) => item.resourceName === oldName);

      if (existedResourceIndex === -1) return;

      const newArr = [...aoaiResources];
      newArr[existedResourceIndex] = resource;
      if (setStorage(AOAI_CREDENTIAL_KEY, newArr)) {
        setAoaiResources(newArr);
        enqueueSnackbar('Updated successfully');
      } else {
        enqueueSnackbar(`Failed to update resource`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [aoaiResources]
  );

  const handlePrimaryAoaiResource = useCallback(
    (resourcName: string) => {
      if (!resourcName || resourcName.length === 0) return;
      const existedResourceIndex = aoaiResources.findIndex(
        (item) => item.resourceName === resourcName
      );

      if (existedResourceIndex === -1) return;

      const newArr = aoaiResources
        .filter((_, index) => index !== existedResourceIndex)
        .map((item) => ({ ...item, primary: false }));

      const updatedResource = { ...aoaiResources[existedResourceIndex], primary: true };

      const finalArr = [updatedResource, ...newArr];

      if (setStorage(AOAI_CREDENTIAL_KEY, finalArr)) {
        setAoaiResources(finalArr);
        enqueueSnackbar('Updated successfully');
      } else {
        enqueueSnackbar(`Failed to update resource`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line
    [aoaiResources]
  );

  const handleDownloadAoaiResource = useCallback(async () => {
    if (aoaiResources && aoaiResources.length > 0) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(aoaiResources)
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'aoai_credentials.json';
      link.click();
    }
  }, [aoaiResources]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        if (e.target && e.target.result) {
          if (typeof e.target.result === 'string') {
            const importedResources = JSON.parse(e.target.result);
            if (importedResources.length === 0) return;
            if (setStorage(AOAI_CREDENTIAL_KEY, importedResources)) {
              setAoaiResources(importedResources);
              enqueueSnackbar('Imported successfully');
            } else {
              enqueueSnackbar(`Failed to import resources`, { variant: 'error' });
            }
          }
        }
      };
    }
  };

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <AccountAoaiResources
          aoaiResources={aoaiResources}
          onAddNewAoaiResource={handleAddNewAoaiResource}
          onUpdateAoaiResource={handleUpdateAoaiResource}
          onDeleteAoaiResource={handleRemoveAoaiResource}
          onDownloadAoaiResource={handleDownloadAoaiResource}
          onUploadAoaiResource={handleAttach}
          onSetPrimaryAoaiResource={handlePrimaryAoaiResource}
        />
      </Grid>
      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
    </Grid>
  );
}
