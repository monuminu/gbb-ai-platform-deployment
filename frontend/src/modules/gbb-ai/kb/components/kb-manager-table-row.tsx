// import { utcToZonedTime } from 'date-fns-tz';
import { useState, useCallback } from 'react';
import chatIcon from '@iconify/icons-entypo/chat';
import { format, formatDistanceToNowStrict } from 'date-fns';
import crowdsourceIcon from '@iconify/icons-simple-icons/crowdsource';
import moreHorizontalFill from '@iconify/icons-eva/more-horizontal-fill';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IDatasetManager } from 'src/types/kb';

import FileManagerShareDialog from './kb-manager-share-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IDatasetManager;
  dense: boolean;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function KbManagerTableRow({
  row,
  dense,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, createdAt, modifiedAt, type, shared, tags } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: onEditRow,
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.id);
  }, [copy, enqueueSnackbar, row.id]);

  // Get the user's timezone
  // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert the date to the user's timezone
  // const createdAtInUserTimezone = utcToZonedTime(new Date(`${createdAt} GMT+0000`), userTimezone);
  // const modifiedAtInUserTimezone = utcToZonedTime(new Date(`${modifiedAt} GMT+0000`), userTimezone);

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              color: 'text.primary',
              typography: 'subtitle2',
              bgcolor: 'background.default',
            },
          }),
        }}
      >
        <TableCell sx={{ pl: 2, maxWidth: 40, minWidth: 40, ...(!dense && { py: 1.25 }) }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell onClick={handleClick} sx={{ maxWidth: 640, ...(!dense && { py: 1.25 }) }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <FileThumbnail file="folder" sx={{ width: 24, height: 24 }} />

            <ListItemText
              disableTypography
              primary={
                <Link
                  color="inherit"
                  variant="subtitle2"
                  onClick={onEditRow}
                  sx={{
                    wordBreak: 'break-all',
                    cursor: 'pointer',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: dense ? 1 : 2,
                  }}
                >
                  {name}
                </Link>
              }
            />
          </Stack>
        </TableCell>

        <TableCell align="left" onClick={handleClick} sx={{ ...(!dense && { py: 1.25 }) }}>
          {type && (
            <Chip
              size="small"
              color={type.toLowerCase() === 'qa' ? 'primary' : 'warning'}
              variant="soft"
              icon={
                <Iconify
                  icon={type.toLowerCase() === 'qa' ? chatIcon : crowdsourceIcon}
                  sx={{ width: 13, height: 13 }}
                />
              }
              label={type === '' ? 'QA' : type}
              sx={{ height: 23, pl: 0.4, textTransform: 'uppercase' }}
            />
          )}
        </TableCell>

        <TableCell
          onClick={handleClick}
          sx={{ maxWidth: 160, whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
        >
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2">{format(new Date(createdAt), 'dd MMM yyyy')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(createdAt), 'p')}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{
            maxWidth: 140,
            color: 'text.primary',
            whiteSpace: 'nowrap',
            ...(!dense && { py: 1.25 }),
          }}
        >
          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={0.5}>
              <Chip
                size="small"
                color="default"
                variant="soft"
                label={tags[0]}
                sx={{ height: 23, maxWidth: 100 }}
              />
              {tags.length > 1 && (
                <Chip
                  size="small"
                  color="default"
                  variant="soft"
                  label={tags[1]}
                  sx={{ height: 23 }}
                />
              )}
              {tags.length > 2 && (
                <Chip
                  size="small"
                  color="info"
                  variant="soft"
                  label={`+${tags.length - 1}`}
                  sx={{ height: 23 }}
                />
              )}
            </Stack>
          )}
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
        >
          {formatDistanceToNowStrict(new Date(modifiedAt), {
            addSuffix: true,
          })}
        </TableCell>

        {/* <TableCell align="center" onClick={handleClick}>
          {size}
        </TableCell> */}

        <TableCell align="right" onClick={handleClick} sx={{ ...(!dense && { py: 1.25 }) }}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': { fontSize: 12 },
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
          sx={{ px: 1, pr: 2, whiteSpace: 'nowrap', ...(!dense && { py: 1.25 }) }}
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
        sx={{ width: 160, borderRadius: 1 }}
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

      <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
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
