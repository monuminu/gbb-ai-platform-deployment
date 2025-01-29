import { useCallback } from 'react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import sidebarClose from '@iconify/icons-lucide/sidebar-close';

// mui
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
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// project import
import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { RHFUploadAvatar } from 'src/components/hook-form';

import { ITool } from 'src/types/tool';

import ToolDetailSidebar from './tool-detail-sidebar';

// ----------------------------------------------------------------------

const TABLE_HEADS = [
  { id: 'icon', label: 'Icon', width: 60, minWidth: 60, maxWidth: 60 },
  { id: 'description', label: 'Description', width: 260, minWidth: 200, maxWidth: 320 },
  { id: 'status', label: 'Status', width: 140, minWidth: 100, maxWidth: 160 },
  { id: 'createdAt', label: 'Created', width: 160, minWidth: 160, maxWidth: 220 },
  { id: 'tags', label: 'Tags', width: 140, minWidth: 100, maxWidth: 'auto' },
  { id: 'modifiedAt', label: 'Modified', width: 160, minWidth: 120, maxWidth: 220 },
  { id: 'shared', label: 'Maintainers', align: 'right', width: 100 },
  { id: '', width: 40, minWidth: 30, maxWidth: 60 },
];

const TableHeaderStyle = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0.25),
  '&::after': { borderBottom: 'none' },
}));

const TableRowStyle = styled(TableCell)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.25),
  paddingBottom: theme.spacing(0.25),
}));

// ----------------------------------------------------------------------

type Props = {
  methods?: any;
  currentTool: ITool;
};

export default function ToolDetailTopTable({ methods, currentTool }: Props) {
  const { createdAt, modifiedAt } = currentTool;

  const { watch, setValue } = methods;

  const values = watch();

  const { tags, shared, description } = values as ITool;

  const sidebar = useBoolean();

  const handleClick = () => {
    sidebar.onTrue();
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      // console.log(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('cover', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <Card sx={{ px: 0, py: 0.75, pb: 0, mb: 1 }}>
      <TableContainer sx={{ overflowY: 'hidden', py: 0.5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADS.map((head, index) => (
                <TableHeaderStyle
                  key={head.id}
                  sx={{
                    width: head.width,
                    minWidth: head.minWidth,
                    maxWidth: head.maxWidth,
                    pl: index === 0 ? 2 : 1,
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
                align="left"
                sx={{ pl: 2, color: 'text.primary', maxWidth: 80, py: 1 }}
              >
                <RHFUploadAvatar
                  name="cover"
                  maxSize={3245728}
                  onDrop={handleDrop}
                  rectangular
                  sx={{ width: 38, height: 38, borderRadius: 1, ml: 0, mr: 0.25 }}
                />
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ pr: 2.5, color: 'text.primary', maxWidth: 320, py: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {description || ''}
                </Typography>
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap', py: 1 }}
              >
                <Label
                  variant="soft"
                  color={(currentTool.status === 'published' && 'success') || 'warning'}
                >
                  {currentTool.status}
                </Label>
              </TableRowStyle>

              <TableRowStyle onClick={handleClick} sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="body2">
                    {format(new Date(createdAt), 'dd MMM yyyy')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(createdAt), 'p')}
                  </Typography>
                </Stack>
              </TableRowStyle>

              <TableRowStyle
                align="center"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap', py: 1 }}
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
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap', py: 1 }}
              >
                {formatDistanceToNowStrict(new Date(modifiedAt), {
                  addSuffix: true,
                })}
              </TableRowStyle>

              <TableRowStyle align="left" onClick={handleClick}>
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

      <ToolDetailSidebar
        item={values}
        open={sidebar.value}
        onClose={sidebar.onFalse}
        onDelete={() => {}}
      />
    </Card>
  );
}
