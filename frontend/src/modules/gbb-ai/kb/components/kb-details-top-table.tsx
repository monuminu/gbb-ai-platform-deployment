import chatIcon from '@iconify/icons-entypo/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import sidebarClose from '@iconify/icons-lucide/sidebar-close';
import crowdsourceIcon from '@iconify/icons-simple-icons/crowdsource';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// project import
import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTimeYMdHms } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import { IDataset } from 'src/types/kb';

import KbDetailsSidebar from './kb-details-sidebar';

// ----------------------------------------------------------------------

const TABLE_HEADS = [
  { id: 'index', label: 'Index', width: 140, minWidth: 100, maxWidth: 200 },
  { id: 'type', label: 'Type', width: 140, minWidth: 100, maxWidth: 180 },
  { id: 'tags', label: 'Tags', width: 180, minWidth: 140, maxWidth: 240 },
  { id: 'createdAt', label: 'Created', width: 180, minWidth: 160, maxWidth: 220 },
  { id: 'modifiedAt', label: 'Modified', width: 140, minWidth: 100, maxWidth: 200 },
  {
    id: 'size',
    label: 'Count',
    width: 100,
    minWidth: 80,
    maxWidth: 120,
    align: 'center' as 'center',
  },
  {
    id: 'shared',
    label: 'Maintainers',
    width: 140,
    minWidth: 120,
    maxWidth: 200,
    align: 'right' as 'right',
  },
  { id: '', width: 80, minWidth: 40, maxWidth: 100 },
];

const TableHeaderStyle = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  '&::after': { borderBottom: 'none' },
}));

const TableRowStyle = styled(TableCell)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.25),
}));

// ----------------------------------------------------------------------

type Props = { kb: IDataset };

export default function KbDetailsTable({ kb }: Props) {
  const { type, createdAt, index, modifiedAt, shared, tags, size } = kb;

  const sidebar = useBoolean();

  const handleClick = () => {
    sidebar.onTrue();
  };

  return (
    <Card sx={{ px: 0, py: 0.75, mb: 1 }}>
      <TableContainer sx={{ overflowY: 'hidden', py: 0.5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADS.map((head, _index) => (
                <TableHeaderStyle
                  key={head.id}
                  align={head.align ? head.align : 'left'}
                  sx={{
                    width: head.width,
                    minWidth: head.minWidth,
                    maxWidth: head.maxWidth,
                    pl: _index === 0 ? 3 : 1,
                  }}
                >
                  {head.label}
                </TableHeaderStyle>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableRowStyle
                onClick={handleClick}
                sx={{ pl: 3, color: 'text.primary', whiteSpace: 'nowrap', fontWeight: '600' }}
              >
                {index || 'N/A'}
              </TableRowStyle>
              <TableRowStyle sx={{ pl: 1 }}>
                {!!type && (
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
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap', maxWidth: 180 }}
              >
                {!!tags && (
                  <Stack direction="row" spacing={0.5}>
                    {tags.map((tag, _index) => (
                      <Chip
                        key={_index}
                        size="small"
                        color="default"
                        variant="soft"
                        label={tag}
                        sx={{ height: 23 }}
                      />
                    ))}
                  </Stack>
                )}
              </TableRowStyle>

              <TableRowStyle onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                {fDateTimeYMdHms(createdAt)}
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
              >
                {formatDistanceToNowStrict(new Date(modifiedAt), {
                  addSuffix: true,
                })}
              </TableRowStyle>

              <TableRowStyle
                align="center"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
              >
                {size}
              </TableRowStyle>

              <TableRowStyle align="right">
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
              </TableRowStyle>

              <TableRowStyle align="right">
                <IconButton onClick={handleClick}>
                  <Iconify icon={sidebarClose} width={18} height={18} />
                </IconButton>
              </TableRowStyle>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <KbDetailsSidebar
        item={kb}
        open={sidebar.value}
        onClose={sidebar.onFalse}
        onDelete={() => {}}
      />
    </Card>
  );
}
