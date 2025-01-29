import { useCallback } from 'react';

import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IAoaiResourceItem } from 'src/types/azure-resource';

import AoaiResourceForm from './aoai-resource-form';

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  fontSize: 13,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

type Props = PaperProps &
  StackProps & {
    action?: React.ReactNode;
    aoaiResource: IAoaiResourceItem;
    onUpdateAoaiResource?: (oldName: string, resource: IAoaiResourceItem) => void;
    onDeleteAoaiResource?: (oldName: string) => void;
    onSetPrimaryAoaiResource: (resourceName: string) => void;
  };

export default function AoaiResourceItem({
  aoaiResource,
  onUpdateAoaiResource,
  onDeleteAoaiResource,
  onSetPrimaryAoaiResource,
  action,
  sx,
  ...other
}: Props) {
  const apiKey = useBoolean();

  const aoaiResourceForm = useBoolean();

  const popover = usePopover();

  const handleClose = useCallback(() => {
    popover.onClose();
  }, [popover]);

  const { resourceName, endpoint, deployment, key, model, primary, apiVersion } = aoaiResource;

  return (
    <>
      <Stack
        component={Paper}
        spacing={2.5}
        alignItems={{ md: 'flex-end' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ position: 'relative', ...sx }}
        {...other}
      >
        <Stack flexGrow={1} spacing={1.25}>
          <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2">{resourceName}</Typography>

            {!!primary && (
              <Label color="warning" sx={{ ml: 1.5 }} startIcon={<Iconify icon="eva:star-fill" />}>
                Default
              </Label>
            )}
          </Stack>

          <Stack direction="row" alignItems="center">
            <StyledLabel>Endpoint</StyledLabel>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {endpoint}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <StyledLabel>Deployment</StyledLabel>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {deployment}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <StyledLabel>Model</StyledLabel>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {model}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <StyledLabel>Key</StyledLabel>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {apiKey.value ? key : key.slice(-4).padStart(key.length, '*')}
            </Typography>
            <IconButton onClick={apiKey.onToggle} edge="end" sx={{ p: 0.35, ml: 1 }}>
              <Iconify
                width={16}
                icon={apiKey.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
              />
            </IconButton>
          </Stack>

          <Stack direction="row" alignItems="center">
            <StyledLabel>API version</StyledLabel>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {apiVersion}
            </Typography>
          </Stack>
        </Stack>

        {/* {action && action} */}
        <Stack sx={{ position: 'absolute', top: 8, right: 8, bottom: -2 }} alignItems="center">
          <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => popover.onOpen(event)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={handleClose}>
        {model.includes('gpt') && (
          <MenuItem
            onClick={() => {
              onSetPrimaryAoaiResource(resourceName);
              handleClose();
            }}
          >
            <Iconify icon="eva:star-fill" sx={{ p: 0.1 }} />
            Set as primary
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            aoaiResourceForm.onTrue();
            handleClose();
          }}
        >
          <Iconify icon="solar:pen-bold" sx={{ p: 0.2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (onDeleteAoaiResource) {
              onDeleteAoaiResource(resourceName);
            }
            handleClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="gravity-ui:trash-bin" sx={{ p: 0.1 }} />
          Delete
        </MenuItem>
      </CustomPopover>

      <AoaiResourceForm
        open={aoaiResourceForm.value}
        onClose={aoaiResourceForm.onFalse}
        onUpdate={onUpdateAoaiResource}
        onDelete={onDeleteAoaiResource}
        resource={aoaiResource}
      />
    </>
  );
}
