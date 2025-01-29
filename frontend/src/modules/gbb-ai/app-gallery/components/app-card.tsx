import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import AppTag from 'src/components/custom-tags/AppTag';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { MlAppStruct } from 'src/types/app';

import MlAppDetailsDrawer from './apps-info/details-drawer';

// ----------------------------------------------------------------------

type Props = {
  mlApp: MlAppStruct;
};

export default function MlAppCard({ mlApp }: Props) {
  const theme = useTheme();

  const router = useRouter();

  const popover = usePopover();
  const { id, title, cover, source, status, scenarios } = mlApp;
  const [mouseEnter, setMouseEnter] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  // const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setMouseEnter(false);
  };

  const handleMouseEnter = () => {
    setMouseEnter(true);
  };

  const handleMouseLeave = () => {
    setMouseEnter(false);
  };

  const handleOpenConfirm = () => {
    // setOpenConfirm(true);
  };

  return (
    // <Card sx={{ boxShadow: theme.customShadows.card }}>
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        // boxShadow: theme.customShadows.z2,
        ...(mouseEnter && {
          boxShadow: theme.customShadows.z24,
        }),
      }}
    >
      {source === 'custom' && (
        <IconButton
          size="small"
          color="inherit"
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 9 }}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      )}

      <Box onClick={handleOpenDetails} sx={{ position: 'relative', p: 1 }}>
        <Image
          alt={title}
          src={cover}
          ratio={source === 'custom' ? '16/9' : '4/3'}
          sx={{ borderRadius: 0.85, height: source === 'custom' ? 140 : 200 }}
        />
      </Box>

      <Stack spacing={1.5} sx={{ p: 1.5, pt: 0.5, pb: 1.5 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {source === 'built-in' && scenarios !== undefined && scenarios.length > 0 && (
            <AppTag
              title={scenarios[0].title as string}
              color={scenarios[0].color}
              sx={{ height: 24, textTransform: 'none', borderRadius: 0.75 }}
            />
          )}
          {source === 'custom' && (
            <AppTag
              title={status === 'published' ? 'Published' : 'Draft'}
              color={status === 'published' ? 'success' : 'default'}
              sx={{ height: 24, textTransform: 'none', borderRadius: 0.75 }}
            />
          )}
          {source === 'built-in' && (scenarios === undefined || scenarios.length === 0) && <span />}

          <Button
            to={paths.gbbai.appGallery.details(id)}
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

      <MlAppDetailsDrawer
        item={mlApp}
        favorited={false}
        onFavorite={() => {}}
        onCopyLink={() => {}}
        open={openDetails}
        onClose={handleCloseDetails}
        onDeleteRow={handleOpenConfirm}
        // onDelete={() => {
        //   handleCloseDetails();
        //   onDelete();
        // }}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-center"
        sx={{ width: 120 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.gbbai.appGallery.customGpt.edit(id));
          }}
        >
          <Iconify icon="solar:pen-bold" sx={{ p: 0.2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="gravity-ui:trash-bin" width={18} />
          Delete
        </MenuItem>
      </CustomPopover>
    </Card>
  );
}
