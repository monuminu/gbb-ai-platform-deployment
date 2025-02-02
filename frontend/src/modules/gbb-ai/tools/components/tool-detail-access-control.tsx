import List from '@mui/material/List';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import Scrollbar from 'src/components/scrollbar';

import { IFileShared } from 'src/types/file';

import ToolDetailAccessItem from './tool-detail-access-item';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  inviteEmail?: string;
  shared?: IFileShared[] | null;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
};

export default function ToolAccessControlDialog({
  shared,
  inviteEmail,
  onChangeInvite,
  //
  open,
  onClose,
  ...other
}: Props) {
  const hasShared = shared && !!shared.length;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        {onChangeInvite && (
          <TextField
            fullWidth
            value={inviteEmail}
            placeholder="Email"
            onChange={onChangeInvite}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="inherit"
                    variant="contained"
                    disabled={!inviteEmail}
                    sx={{ mr: -0.75 }}
                  >
                    Send Invite
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        {hasShared && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {shared.map((person) => (
                <ToolDetailAccessItem key={person.id} person={person} />
              ))}
            </List>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions>
        <Button size="small" variant="contained" color="primary">
          Ok
        </Button>
        {onClose && (
          <Button size="small" variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
