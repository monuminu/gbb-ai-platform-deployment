import closeFill from '@iconify/icons-eva/close-fill';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { IFileManager } from 'src/types/file';

// ----------------------------------------------------------------------

type Props = {
  row: IFileManager;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function FileListTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const theme = useTheme();

  const { name, size, type } = row;

  const details = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            // boxShadow: theme.customShadows.z4,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              // boxShadow: theme.customShadows.z4,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell padding="checkbox" sx={{ height: 60 }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ ml: -1.75, mr: -0.5 }}>
            <FileThumbnail file={type} sx={{ width: 26, height: 26 }} />
            <Typography
              variant="inherit"
              sx={{
                cursor: 'pointer',
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                wordBreak: 'break-all',
              }}
            >
              {name}
            </Typography>

            {/* <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 180,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography> */}
          </Stack>
        </TableCell>

        <TableCell
          onClick={handleClick}
          sx={{ whiteSpace: 'nowrap', width: 70, minWidth: 70, maxWidth: 70 }}
        >
          {fData(size)}
        </TableCell>

        <TableCell
          onClick={handleClick}
          sx={{ whiteSpace: 'nowrap', width: 40, minWidth: 40, maxWidth: 40 }}
        >
          {type}
        </TableCell>

        <TableCell
          align="right"
          sx={{
            pr: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon={closeFill} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <Iconify icon="ic:baseline-share" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

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
      </CustomPopover> */}

      {/* <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      /> */}

      {/* <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      /> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
