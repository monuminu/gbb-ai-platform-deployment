import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moreHorizontalFill from '@iconify/icons-eva/more-horizontal-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import Paper, { PaperProps } from '@mui/material/Paper';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { MlAppStruct } from 'src/types/app';

import MlAppDetailsDrawer from '../meta-info/details-drawer';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: number;
  mlApp: MlAppStruct;
  onDelete: (_id: string) => Promise<void>;
};

export default function GptCategoryItem({ mlApp, index, onDelete, sx, ...other }: Props) {
  const theme = useTheme();

  const router = useRouter();

  const confirm = useBoolean();

  const popover = usePopover();

  const openDetails = useBoolean();

  const isLight = theme.palette.mode === 'light';

  const [deleting, setDeleting] = useState(false);

  const customGpt = mlApp ? JSON.parse(mlApp.content) : null;

  const gptId = mlApp ? mlApp.id : '';

  const handleDelete = useCallback(async () => {
    if (!gptId) return;

    setDeleting(true);
    try {
      await onDelete(gptId);
      confirm.onFalse();
      popover.onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }, [gptId, onDelete, confirm, popover]);

  if (customGpt === null || customGpt === undefined) {
    return null;
  }

  return (
    <>
      <Paper
        onClick={openDetails.onTrue}
        sx={{
          width: 1,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: isLight
            ? `${alpha(theme.palette.background.paper, 0.88)}`
            : `${alpha(theme.palette.background.default, 0.88)}`,
          boxShadow: theme.customShadows.z1,
          '&:hover': {
            boxShadow: theme.customShadows.z20,
          },
          ...(openDetails.value && {
            boxShadow: theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack alignItems="left" spacing={1.5} sx={{ height: 1, p: 2 }}>
          <Stack direction="row" alignItems="center" sx={{ with: '100%', mb: 1 }}>
            <Avatar alt="copilot" src={mlApp.cover} sx={{ width: 48, height: 48, mr: 2 }} />
            <Stack sx={{ height: 1, with: '100%' }}>
              <TextMaxLine variant="subtitle1" line={1} sx={{ color: 'text.primary' }}>
                {mlApp.title || ''}
              </TextMaxLine>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 0.5, mb: 0 }}
              >
                <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                  By Lei, {fDate(mlApp.dateModified)}
                </Box>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={1.5} sx={{ position: 'relative', width: 1 }}>
            <TextMaxLine
              variant="body2"
              line={2}
              sx={{ color: 'text.secondary', fontSize: '13px' }}
            >
              {customGpt.description || ''}
            </TextMaxLine>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ mb: -1.25, ml: -1, mr: -0.25, position: 'relative', height: 1 }}
              justifyContent="space-between"
            >
              <IconButton
                color={popover.open ? 'inherit' : 'default'}
                onClick={(event) => {
                  event.stopPropagation();
                  popover.onOpen(event);
                }}
              >
                <Iconify icon={moreHorizontalFill} />
              </IconButton>

              <Button
                to={paths.gbbai.gpts.details(mlApp.id)}
                component={RouterLink}
                size="small"
                color="inherit"
                sx={{ height: 24 }}
                endIcon={<Icon icon={arrowIosForwardFill} style={{ marginLeft: '-5px' }} />}
              >
                Enter
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-center"
        sx={{ width: 128 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.gbbai.gpts.edit(mlApp.id));
          }}
        >
          <Iconify icon="solar:pen-bold" sx={{ p: 0.2 }} />
          Edit
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.gbbai.gpts.edit(mlApp.id));
          }}
        >
          <Iconify icon="heroicons:document-duplicate-16-solid" />
          Duplicate
        </MenuItem> */}

        <MenuItem onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
          <Iconify icon="gravity-ui:trash-bin" width={18} />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure to delete?</>}
        action={
          <LoadingButton
            loading={deleting}
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />

      <MlAppDetailsDrawer
        item={mlApp}
        favorited={false}
        onFavorite={() => {}}
        onCopyLink={() => {}}
        open={openDetails.value}
        onClose={openDetails.onFalse}
        onDeleteRow={() => {}}
      />
    </>
  );
}
