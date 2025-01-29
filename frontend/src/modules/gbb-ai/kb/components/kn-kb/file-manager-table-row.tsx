import { format } from 'date-fns';
import { useEffect, useCallback } from 'react';
import moreHorizontalFill from '@iconify/icons-eva/more-horizontal-fill';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';

import { getKbItem } from 'src/api/kmm';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import Label, { LabelColor } from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { KbItemManager } from 'src/types/kb';

import FileManagerFileDetails from './file-manager-file-details';

// ----------------------------------------------------------------------

type Props = {
  kbId: string;
  row: KbItemManager;
  dense: boolean;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onUpdateRow: (newRow: KbItemManager) => void;
};

export default function FileManagerTableRow({
  kbId,
  row,
  dense,
  selected,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: Props) {
  const { id, name, size, type, chunks, modifiedAt, shared, status, isFavorited, error } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  useEffect(() => {
    let intervalId: any = null;
    if (!!status && !status.includes('loading') && status.includes('ing')) {
      intervalId = setInterval(() => {
        if (!status.includes('ing')) {
          clearInterval(intervalId);
        } else {
          getKbItem(kbId, id)
            .then((item: KbItemManager) => {
              if (item.status !== status) onUpdateRow({ ...item });
              if (!item.status.includes('ing')) clearInterval(intervalId);
            })
            .catch((e) => enqueueSnackbar(e, { variant: 'error' }));
        }
      }, 10000);

      return () => clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [status]);

  const handleClick = () => {};

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  let color = 'default';
  if (status.toLowerCase().startsWith('uploaded')) {
    color = 'default';
  } else if (status.toLowerCase().startsWith('indexing')) {
    color = 'secondary';
  } else if (status.toLowerCase().startsWith('indexed')) {
    color = 'primary';
  } else if (status.toLowerCase().startsWith('uploading')) {
    color = 'warning';
  } else if (status.toLowerCase().startsWith('prep')) {
    color = 'warning';
  } else if (status.toLowerCase().startsWith('failed')) {
    color = 'error';
  }

  return (
    <>
      <TableRow selected={selected}>
        <TableCell sx={{ pl: 2, maxWidth: 40, minWidth: 40, ...(!dense && { py: 1.25 }) }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell onClick={handleClick} sx={{ maxWidth: 320, ...(!dense && { py: 1.25 }) }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <FileThumbnail file={type?.toLowerCase() || ''} sx={{ width: 24, height: 24 }} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                // cursor: 'pointer',
                minWidth: 180,
                maxWidth: 340,
                typography: 'subtitle2',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          align="center"
          onClick={handleClick}
          sx={{ whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
        >
          {chunks}
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
        >
          {status.toLowerCase().startsWith('fail') && error && (
            <Tooltip title={error}>
              <Label variant="soft" color={color as LabelColor}>
                {status}
              </Label>
            </Tooltip>
          )}
          {(!status.toLowerCase().startsWith('fail') || !error) && (
            <Label variant="soft" color={color as LabelColor}>
              {status}
            </Label>
          )}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}>
          {fData(size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}>
          {type}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2">{format(new Date(modifiedAt), 'dd MMM yyyy')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(modifiedAt), 'p')}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          align="right"
          onClick={handleClick}
          sx={{ width: 100, minWidth: 100, maxWidth: 110, ...(!dense && { py: 1.25 }) }}
        >
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {shared &&
              shared.map((person) => (
                <Avatar
                  key={person.id}
                  alt={person.name}
                  src={person.photo ? person.photo : person.avatarUrl}
                />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell
          align="right"
          sx={{ pl: 1, pr: 2, whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
        >
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon={moreHorizontalFill} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-center"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="gravity-ui:trash-bin" width={18} />
          Delete
        </MenuItem>
      </CustomPopover>

      <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm"
        content="Are you sure to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
