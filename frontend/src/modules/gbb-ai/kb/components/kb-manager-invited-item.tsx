import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IFileShared } from 'src/types/file';

// ----------------------------------------------------------------------

type Props = {
  person: IFileShared;
};

export default function FileManagerInvitedItem({ person }: Props) {
  const theme = useTheme();

  const [permission, setPermission] = useState(person.permission);

  const popover = usePopover();

  const handleChangePermission = useCallback((newPermission: string) => {
    setPermission(newPermission);
  }, []);

  return (
    <>
      <ListItem sx={{ px: 0, py: 1 }}>
        <Avatar
          alt={person.name}
          src={person.photo ? person.photo : person.avatarUrl}
          sx={{ mr: 2, border: `2px solid ${alpha(theme.palette.divider, 0.08)}` }}
        />

        <ListItemText
          primary={person.name}
          secondary={
            <Tooltip title={person.email}>
              <span>{person.email}</span>
            </Tooltip>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
          secondaryTypographyProps={{ noWrap: true, component: 'span' }}
          sx={{ flexGrow: 1, pr: 1 }}
        />

        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              width={20}
              icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              sx={{ ml: -1 }}
            />
          }
          onClick={popover.onOpen}
          sx={{
            flexShrink: 0,
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          Can {permission}
        </Button>
      </ListItem>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        <>
          <MenuItem
            selected={permission === 'view'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('view');
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Can view
          </MenuItem>

          <MenuItem
            selected={permission === 'edit'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('edit');
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Can edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="gravity-ui:trash-bin" width={18} />
            Remove
          </MenuItem>
        </>
      </CustomPopover>
    </>
  );
}
