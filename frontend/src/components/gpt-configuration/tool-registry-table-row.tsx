import { formatDistanceToNowStrict } from 'date-fns';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTimeYMdHms } from 'src/utils/format-time';

import { ITool } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = {
  row: ITool;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function ToolRegistryTableRow({ row, selected, onSelectRow }: Props) {
  const { name, cover, description, createdAt, modifiedAt, tags } = row;

  const details = useBoolean();

  return (
    <TableRow
      selected={selected}
      sx={{
        ...(details.value && {
          [`& .${tableCellClasses.root}`]: {
            // ...defaultStyles,
            color: 'text.primary',
            typography: 'subtitle2',
            bgcolor: 'background.default',
          },
        }),
      }}
    >
      <TableCell padding="checkbox" sx={{ pl: 2, ml: 3, height: 48 }}>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Stack direction="row" sx={{ mr: 0, width: '100%', alignItems: 'center' }}>
          <Avatar
            src={cover}
            alt={name}
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0.75,
              mr: 2,
            }}
          >
            {name.charAt(0).toUpperCase() || ''}
          </Avatar>

          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 140 }}>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell
        align="left"
        sx={{
          color: 'text.primary',
          width: 260,
          minWidth: 180,
          maxWidth: 280,
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            cursor: 'pointer',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
          }}
        >
          {(!!description && description) || ''}
        </Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTimeYMdHms(createdAt)}</TableCell>

      <TableCell align="left" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>
        {formatDistanceToNowStrict(new Date(modifiedAt), {
          addSuffix: true,
        })}
      </TableCell>

      <TableCell align="center" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>
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
    </TableRow>
  );
}
