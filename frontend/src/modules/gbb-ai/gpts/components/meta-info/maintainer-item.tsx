import { useState } from 'react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';

import {
  Avatar,
  Button,
  Divider,
  Tooltip,
  ListItem,
  MenuItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover';

import { Maintainer } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  person: Maintainer;
  onChangePermission: (newPermission: string, email: string) => void;
};

export default function MlAppMaintainerItem({ person, onChangePermission }: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangePermission = (newPermission: string) => {
    onChangePermission(newPermission, person.email);
  };

  return (
    <>
      <ListItem disableGutters>
        <ListItemAvatar>
          <Avatar alt={person.name} src={person.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={person.name}
          secondary={
            <Tooltip title={person.email}>
              <span>{person.email}</span>
            </Tooltip>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
          secondaryTypographyProps={{ noWrap: true }}
          sx={{ flexGrow: 1, pr: 1 }}
        />

        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={openPopover ? chevronUpFill : chevronDownFill} />}
          onClick={handleOpenPopover}
          sx={{
            flexShrink: 0,
            textTransform: 'unset',
            fontWeight: 'fontWeightMedium',
            '& .MuiButton-endIcon': {
              ml: 0,
            },
            ...(openPopover && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          Can {person.permission ? person.permission : 'view'}
        </Button>
      </ListItem>

      <CustomPopover
        hiddenArrow
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 160 }}
      >
        <>
          <MenuItem
            onClick={() => {
              handleClosePopover();
              handleChangePermission('view');
            }}
            sx={{
              ...(person.permission === 'view' && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <Iconify icon={eyeFill} />
            Can view
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              handleChangePermission('edit');
            }}
            sx={{
              ...(person.permission === 'edit' && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <Iconify icon={editFill} />
            Can edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon={trash2Outline} />
            Remove
          </MenuItem>
        </>
      </CustomPopover>
    </>
  );
}
