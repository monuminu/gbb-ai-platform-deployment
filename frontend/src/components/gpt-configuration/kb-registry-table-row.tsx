import chatIcon from '@iconify/icons-entypo/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import crowdsourceIcon from '@iconify/icons-simple-icons/crowdsource';

// mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// project import
import { fDateTimeYMdHms } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';

import { IDatasetManager } from 'src/types/kb';

// ----------------------------------------------------------------------

type Props = {
  row: IDatasetManager;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function KbRegistryTableRow({ row, selected, onSelectRow }: Props) {
  const { name, createdAt, modifiedAt, type, tags } = row;

  return (
    <TableRow selected={selected}>
      <TableCell padding="checkbox" sx={{ pl: 2, height: 48 }}>
        <Radio size="small" checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FileThumbnail file="folder" sx={{ width: 23, height: 23 }} />

          <Typography noWrap variant="subtitle2" sx={{ maxWidth: '100%', cursor: 'pointer' }}>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
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

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTimeYMdHms(createdAt)}</TableCell>

      <TableCell align="left" sx={{ color: 'text.primary', whiteSpace: 'nowrap', maxWidth: 180 }}>
        {tags && tags.length > 0 && (
          <Stack direction="row" spacing={0.5}>
            <Chip size="small" color="default" variant="soft" label={tags[0]} sx={{ height: 23 }} />
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

      <TableCell align="left" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>
        {formatDistanceToNowStrict(new Date(modifiedAt), {
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  );
}
