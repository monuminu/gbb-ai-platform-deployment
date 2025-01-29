import { useState, useCallback } from 'react';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { CustomFile } from 'src/components/upload';

import { ITool } from 'src/types/tool';

import FileManagerInvitedItem from './tool-detail-access-item';
import ToolAccessControlDialog from './tool-detail-access-control';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: ITool;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function ToolDetailSidebar({ item, open, onClose, onDelete, ...other }: Props) {
  const { name, cover, shared, description } = item;

  const hasShared = shared && !!shared.length;

  const toggleTags = useBoolean(true);

  const access = useBoolean();

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const [tags, setTags] = useState(item.tags.slice(0, 3));

  const parsedCover = typeof cover === 'string' ? cover : `${(cover as CustomFile)?.preview}`;

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((newValue: string[]) => {
    setTags(newValue);
  }, []);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={item.tags.map((option) => option)}
          getOptionLabel={(option) => option}
          defaultValue={item.tags.slice(0, 3)}
          value={tags}
          onChange={(event, newValue) => {
            handleChangeTags(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="Add tags" />}
        />
      )}
    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
          <Box component="span" sx={{ width: 100, color: 'text.secondary', mr: 2 }}>
            Description
          </Box>
          {description}
        </Stack>
      )}
    </Stack>
  );

  const accessPanel = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, py: 1.5 }}
      >
        <Typography variant="subtitle2" textTransform="capitalize">
          Manage Access
        </Typography>

        <IconButton size="small" onClick={access.onTrue} sx={{ p: 0.25 }}>
          <Box
            component="img"
            src="/assets/icons/modules/ic_manage_access.svg"
            sx={{ width: 26, height: 26, cursor: 'pointer' }}
          />
        </IconButton>
      </Stack>

      {hasShared && (
        <Box sx={{ pl: 2.5, pr: 1 }}>
          {shared.map((person) => (
            <FileManagerInvitedItem key={person.id} person={person} />
          ))}
        </Box>
      )}
    </>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            <Stack direction="row" alignItems="center">
              <Avatar
                src={parsedCover}
                alt={name}
                sx={{ width: 42, height: 42, borderRadius: 1, mr: 2 }}
              >
                {name.charAt(0).toUpperCase() || ''}
              </Avatar>

              <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                {name}
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderTags}

            {renderProperties}
          </Stack>

          {accessPanel}
        </Scrollbar>

        <Stack sx={{ p: 2 }} direction="row" spacing={1.5}>
          <LoadingButton
            fullWidth
            loading={false}
            variant="soft"
            color="success"
            size="medium"
            startIcon={<Iconify icon={cloudUploadFill} />}
            onClick={() => {}}
            sx={{ height: 38 }}
          >
            Update
          </LoadingButton>
          <LoadingButton
            fullWidth
            variant="soft"
            color="error"
            size="medium"
            startIcon={<Iconify icon="gravity-ui:trash-bin" width={18} />}
            onClick={() => {}}
          >
            Delete
          </LoadingButton>
        </Stack>
      </Drawer>

      <ToolAccessControlDialog
        open={access.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => access.onFalse()}
      />
    </>
  );
}
