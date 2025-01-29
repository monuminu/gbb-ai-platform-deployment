import { format, formatDistanceToNowStrict } from 'date-fns';
import moreHorizontalFill from '@iconify/icons-eva/more-horizontal-fill';

// mui
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// project import
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { ITool } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = {
  row: ITool;
  dense: boolean;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ToolRegistryTableRow({
  row,
  dense,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, cover, description, createdAt, modifiedAt, shared, tags } = row;

  const details = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleClick = useDoubleClick({
    doubleClick: onEditRow,
  });

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
        <TableCell sx={{ pl: 2, maxWidth: 50, minWidth: 40, ...(!dense && { py: 1.5 }) }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell
          sx={{ pr: 0, minWidth: 120, maxWidth: 160, ...(!dense && { py: 1.5 }) }}
          onClick={handleClick}
        >
          <Stack direction="row" sx={{ mr: 0, width: '100%', alignItems: 'center' }}>
            <Avatar
              src={cover}
              alt={name}
              sx={{
                width: dense ? 28 : 38,
                height: dense ? 28 : 38,
                borderRadius: dense ? 0.75 : 1,
                mr: 2,
              }}
            >
              {name.charAt(0).toUpperCase() || ''}
            </Avatar>

            <ListItemText
              sx={{ width: '100%' }}
              disableTypography
              primary={
                <Link
                  noWrap
                  color="inherit"
                  variant="subtitle2"
                  onClick={onEditRow}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    display: 'block',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name}
                </Link>
              }
            />
          </Stack>
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ minWidth: 160, maxWidth: 300, ...(!dense && { py: 1.5 }) }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 13,
              lineHeight: 1.5,
              cursor: 'pointer',
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: dense ? 1 : 2,
            }}
          >
            {description || ''}
          </Typography>
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', ...(!dense && { py: 1.5 }) }}
        >
          <Label variant="soft" color={(row.status === 'published' && 'success') || 'warning'}>
            {row.status}
          </Label>
        </TableCell>

        <TableCell
          onClick={handleClick}
          sx={{ minWidth: 140, maxWidth: 180, whiteSpace: 'nowrap', ...(!dense && { py: 1.5 }) }}
        >
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2">{format(new Date(createdAt), 'dd MMM yyyy')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(createdAt), 'p')}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          align="center"
          onClick={handleClick}
          sx={{
            maxWidth: 140,
            color: 'text.primary',
            whiteSpace: 'nowrap',
            ...(!dense && { py: 1.5 }),
          }}
        >
          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={0.5}>
              {!!tags && (
                <Stack direction="row" spacing={0.5}>
                  <Chip
                    size="small"
                    color="primary"
                    variant="soft"
                    label={tags[0]}
                    sx={{ height: 23, textTransform: 'capitalize' }}
                  />
                  {tags.length > 1 && (
                    <Chip
                      size="small"
                      color="primary"
                      variant="soft"
                      label={`+${tags.length - 1}`}
                      sx={{ height: 23, textTransform: 'capitalize' }}
                    />
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{
            color: 'text.primary',
            minWidth: 90,
            maxWidth: 120,
            whiteSpace: 'nowrap',
            ...(!dense && { py: 1.5 }),
          }}
        >
          {formatDistanceToNowStrict(new Date(modifiedAt), { addSuffix: true })}
        </TableCell>

        <TableCell
          align="right"
          onClick={handleClick}
          sx={{ minWidth: 110, maxWidth: 120, ...(!dense && { py: 1.5 }) }}
        >
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
          sx={{ px: 1, pr: 2, whiteSpace: 'nowrap', ...(!dense && { py: 1.5 }) }}
        >
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon={moreHorizontalFill} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete?"
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
