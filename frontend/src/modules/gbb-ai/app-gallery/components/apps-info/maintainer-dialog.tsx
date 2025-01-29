// @mui
import {
  List,
  Stack,
  Dialog,
  Button,
  DialogProps,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { Maintainer } from 'src/types/user';

import MlAppMaintainerItem from './maintainer-item';
import MlAppMaintainersSection from './maintainer-section';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  maintainers: Maintainer[];
  query: string;
  setQuery: Function;
  onAddMaintainer: Function;
  onChangePermission: (newPermission: string, email: string) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function MlAppMaintainerDialog({
  maintainers,
  query,
  setQuery,
  onAddMaintainer,
  onChangePermission,
  //
  open,
  onClose,
  ...other
}: Props) {
  const hasShared = maintainers ? maintainers.length : 0;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: 3, pb: 3 }}> Add maintainer </DialogTitle>

      <DialogContent sx={{ overflow: 'unset', p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {/* <TextField
              fullWidth
              size="small"
              value={inviteEmail}
              placeholder="Email"
              onChange={onChangeInvite}
            /> */}

          <MlAppMaintainersSection
            query={query}
            setQuery={setQuery}
            onAddMaintainer={onAddMaintainer}
            maintainers={maintainers}
          />

          {/* <Button disabled={false} variant="contained" sx={{ flexShrink: 0 }}>
            Add
          </Button> */}
        </Stack>

        {hasShared > 0 && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {maintainers &&
                maintainers.map((person) => (
                  <MlAppMaintainerItem
                    key={person.email}
                    person={person}
                    onChangePermission={onChangePermission}
                  />
                ))}
            </List>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'right' }}>
        {/* {onCopyLink && (
          <Button
            startIcon={<Iconify icon="eva:link-2-fill" />}
            onClick={onCopyLink}
          >
            Copy link
          </Button>
        )} */}

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
