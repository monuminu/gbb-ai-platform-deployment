// import { useSnackbar } from 'notistack';
// import { shallowEqual } from 'react-redux';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useRef, useState, useCallback } from 'react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';
import applicationOne from '@iconify/icons-icon-park-twotone/application-one';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  List,
  Stack,
  Drawer,
  Button,
  Divider,
  InputBase,
  TextField,
  Typography,
  IconButton,
  StackProps,
  DrawerProps,
  Autocomplete,
} from '@mui/material';

// import { useAuthContext } from 'src/auth/hooks';
// redux
// import { udpateMlAppMetaData } from '../../../../../redux/slices/mlApps';
// import { RootState, useDispatch, useSelector } from 'src/redux/store';
// utils
import { fDateTimeYMdHms } from 'src/utils/format-time';
// import getAccessToResource from 'src/utils/checkResourceAccess';

import { ColorType } from 'src/custom/palette';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ColorSinglePicker } from 'src/components/color-utils';

import { MlAppStruct } from 'src/types/app';
import { Maintainer } from 'src/types/user';

import MlAppMaintainerItem from './maintainer-item';
import MlAppMaintainerDialog from './maintainer-dialog';
// import { FILTER_SCENARIO_OPTIONS } from '../app-filter-sidebar';

// ----------------------------------------------------------------------

export const COLOR_OPTIONS = [
  'default.main',
  'primary.main',
  'success.main',
  'secondary.main',
  'info.main',
  'warning.main',
  'error.main',
];

const extractColor = (color: string) => {
  const cl = color.replace('main', '') || 'default';
  return cl as ColorType;
};

// ----------------------------------------------------------------------

interface Props extends DrawerProps {
  item: MlAppStruct;
  favorited?: boolean;
  //
  onFavorite?: VoidFunction;
  onCopyLink: VoidFunction;
  //
  onClose: VoidFunction;
  onDeleteRow: VoidFunction;
}

export default function MlAppDetailsDrawer({
  item,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,
  onClose,
  onDeleteRow,
  ...other
}: Props) {
  const ref = useRef(null);

  // const { user } = useAuthContext();

  // const dispatch = useDispatch();

  // const { enqueueSnackbar } = useSnackbar();

  const { title, scenarios, maintainers, dateCreated, dateModified } = item;
  // const { title, tags, scenarios, maintainers, dateCreated, dateModified } = item;
  // const dateCreated = new Date();
  // const dateModified = new Date();
  // const maintainers: Maintainer[] = [];

  // const isUpdatingMlAppMetaData = useSelector(
  //   (state: RootState) => state.mlApp.isUpdatingMlAppMetaData,
  //   shallowEqual
  // );

  const isUpdatingMlAppMetaData = false;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [mlAppTitle, setMlAppTitle] = useState(title);

  const [mlAppMaintainers, setMlAppMaintainers] = useState(maintainers);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [query, setQuery] = useState('');

  const [openShare, setOpenShare] = useState(false);

  const [selectedScenarioInd, setSelectedScenarioInd] = useState(-1);

  const [toggleTags, setToggleTags] = useState(true);

  // const mlAppTags = tags;

  const [mlAppScenarios, setMlAppScenarios] = useState(scenarios || []);

  const [toggleProperties, setToggleProperties] = useState(true);

  const hasShared = mlAppMaintainers && !!mlAppMaintainers.length;

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleAddMaintainers = (_maintainers: Maintainer[]) => {
    setQuery('');
    setMlAppMaintainers(_maintainers);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMlAppTitle(event.target.value);
  };

  const handleChangeScenario = useCallback((newValue: string[]) => {
    setMlAppScenarios((prev) => {
      const newScenarios = newValue.map((val) => {
        const existed = prev.find((scenario) => scenario.title === val);
        return { title: val, color: existed ? existed.color : 'default' };
      });

      return newScenarios;
    });
    setSelectedScenarioInd(-1);
  }, []);

  const handleChangeScenarioColor = useCallback(
    (newValue: string) => {
      setMlAppScenarios((prev) => {
        const newScenarios = [...prev];
        newScenarios[selectedScenarioInd] = {
          ...newScenarios[selectedScenarioInd],
          color: newValue.replace('.main', '') as ColorType,
        };
        return newScenarios;
      });
    },
    [selectedScenarioInd]
  );

  const handleToggleTags = () => {
    setToggleTags(!toggleTags);
  };

  const handleChangePermission = (newPermission: string, email: string) => {
    const targetIndex = mlAppMaintainers.findIndex((person) => person.email === email);
    if (targetIndex === -1) return;
    const newPerson = {
      ...mlAppMaintainers[targetIndex],
      permission: newPermission,
    };
    let newMaintainers: Maintainer[] = [];
    if (targetIndex === 0) {
      newMaintainers = newMaintainers.concat(newPerson, mlAppMaintainers.slice(1));
    } else if (targetIndex === mlAppMaintainers.length - 1) {
      newMaintainers = newMaintainers.concat(mlAppMaintainers.slice(0, -1), newPerson);
    } else if (targetIndex > 0) {
      newMaintainers = newMaintainers.concat(
        mlAppMaintainers.slice(0, targetIndex),
        newPerson,
        mlAppMaintainers.slice(targetIndex + 1)
      );
    }
    setMlAppMaintainers(newMaintainers);
  };

  const handleToggleProperties = () => {
    setToggleProperties(!toggleProperties);
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  // const callbackForUpdate = (content: string, variant: any) => {
  //   enqueueSnackbar(content, { variant: variant });
  // };

  const handleOpenConfirm = () => {
    // if (getAccessToResource(user, mlAppMaintainers) === 'edit') {
    setOpenConfirm(true);
    // } else {
    //   enqueueSnackbar('Permission denied', {
    //     variant: 'error',
    //   });
    // }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleUpdateMetaInfo = async () => {
    try {
      // if (getAccessToResource(user, maintainers) === 'edit') {
      // const dateModified = fDateTimeYMdHms(new Date());
      // console.log({
      //   ...item,
      //   title: mlAppTitle,
      //   maintainers: mlAppMaintainers ? mlAppMaintainers : [],
      //   dateModified: dateModified,
      //   ...(tags && { tags: mlAppTags }),
      //   ...(mlAppScenarios && { scenarios: mlAppScenarios }),
      // });
      // await dispatch(
      //   udpateMlAppMetaData(
      //     {
      //       ...item,
      //       title: mlAppTitle,
      //       maintainers: mlAppMaintainers ? mlAppMaintainers : [],
      //       dateModified: dateModified,
      //       scenarios: mlAppScenarios ? mlAppScenarios : [],
      //       ...(tags && { tags: mlAppTags }),
      //     },
      //     callbackForUpdate
      //   )
      // );
      onClose();
      // } else {
      //   enqueueSnackbar('Permission denied', {
      //     variant: 'error',
      //   });
      // }
    } catch (error) {
      // setErrors(error);
    }
  };

  // console.log(mlAppScenarios);
  // console.log(selectedScenarioInd);

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        anchor="right"
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Box sx={{ p: 2, px: 2.5 }}>
            <Typography variant="h6"> Info </Typography>
          </Box>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* <FileThumbnail
                imageView
                file={"folder"}
                sx={{ width: 36, height: 36 }}
                imgSx={{ borderRadius: 1 }}
              /> */}

              <Iconify
                icon={applicationOne}
                width={38}
                height={38}
                sx={{ color: 'primary.dark', width: 32 }}
              />

              <InputBase
                // autoFocus
                fullWidth
                value={mlAppTitle}
                onChange={handleChangeTitle}
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-input': {
                    py: 1,
                    borderRadius: 1,
                    typography: 'h6',
                    border: `solid 1px transparent`,
                    transition: (theme) =>
                      theme.transitions.create(['padding-left', 'border-color']),
                    '&:hover, &:focus': {
                      pl: 0.5,
                      border: (theme) => `solid 1px ${theme.palette.text.primary}`,
                    },
                  },
                }}
              />

              {/* <Typography variant="h6" sx={{ wordBreak: "break-all" }}>
                {title}
              </Typography> */}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack spacing={1}>
              <Panel label="Scenario" toggle={toggleTags} onToggle={handleToggleTags} />

              {toggleTags && mlAppScenarios && (
                <Autocomplete
                  multiple
                  limitTags={2}
                  size="small"
                  disablePortal
                  freeSolo
                  options={[]}
                  value={mlAppScenarios.map((sce) => sce.title)}
                  onChange={(_, newValue) => {
                    handleChangeScenario(newValue);
                  }}
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip
                        {...getTagProps({ index })}
                        ref={ref}
                        size="small"
                        variant="soft"
                        color={extractColor(mlAppScenarios[index].color)}
                        label={option}
                        key={option}
                        onClick={(event) => {
                          setSelectedScenarioInd(index);
                          handleOpenPopover(event);
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} placeholder="Set scenario" />}
                />
              )}

              <CustomPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="bottom-center"
                sx={{ p: 0.5 }}
                hiddenArrow
              >
                <ColorSinglePicker
                  {...(mlAppScenarios &&
                    selectedScenarioInd > -1 && {
                      color: `${mlAppScenarios[selectedScenarioInd].color}.main`,
                    })}
                  colors={COLOR_OPTIONS}
                  onChange={(event) => {
                    handleChangeScenarioColor(event.target.value);
                  }}
                />
              </CustomPopover>
            </Stack>

            <Stack spacing={1.5}>
              <Panel
                label="Properties"
                toggle={toggleProperties}
                onToggle={handleToggleProperties}
              />

              {toggleProperties && (
                <Stack spacing={1.5}>
                  {/* <Row label="Size" value={fData(size)} /> */}
                  {/* 
                  <Row label="Created" value={dateCreated.toString()} />

                  <Row label="Modified" value={dateModified.toString()} /> */}
                  <Row label="Created" value={dateCreated ? fDateTimeYMdHms(dateCreated) : 'N/A'} />

                  <Row
                    label="Modified"
                    value={dateModified ? fDateTimeYMdHms(dateModified) : 'N/A'}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2"> Maintainers </Typography>

            <IconButton
              size="small"
              color="success"
              onClick={handleOpenShare}
              sx={{
                p: 0,
                width: 24,
                height: 24,
                color: 'common.white',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Iconify icon={plusFill} />
            </IconButton>
          </Stack>

          {hasShared && (
            <List disablePadding sx={{ pl: 2.5, pr: 1 }}>
              {mlAppMaintainers &&
                mlAppMaintainers.map((person) => (
                  <MlAppMaintainerItem
                    key={person.email}
                    person={person}
                    onChangePermission={handleChangePermission}
                  />
                ))}
            </List>
          )}
        </Scrollbar>

        <Stack sx={{ p: 2 }} direction="row" spacing={1.5}>
          <LoadingButton
            fullWidth
            loading={isUpdatingMlAppMetaData}
            variant="soft"
            color="success"
            size="medium"
            startIcon={<Iconify icon={cloudUploadFill} />}
            onClick={handleUpdateMetaInfo}
            sx={{ height: 38 }}
          >
            Update
          </LoadingButton>
          <LoadingButton
            fullWidth
            variant="soft"
            color="error"
            size="medium"
            startIcon={<Iconify icon={trash2Outline} />}
            onClick={handleOpenConfirm}
          >
            Delete
          </LoadingButton>
        </Stack>
      </Drawer>

      <MlAppMaintainerDialog
        open={openShare}
        maintainers={mlAppMaintainers}
        query={query}
        setQuery={setQuery}
        onAddMaintainer={handleAddMaintainers}
        onChangePermission={handleChangePermission}
        onClose={() => {
          handleCloseShare();
        }}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
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

// ----------------------------------------------------------------------

interface PanelProps extends StackProps {
  label: string;
  toggle: boolean;
  onToggle: VoidFunction;
}

function Panel({ label, toggle, onToggle, ...other }: PanelProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
      <Typography variant="subtitle2"> {label} </Typography>

      <IconButton size="small" onClick={onToggle}>
        <Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
      </IconButton>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type RowProps = {
  label: string;
  value: string;
};

function Row({ label, value = '' }: RowProps) {
  return (
    <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
      <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
        {label}
      </Box>

      {value}
    </Stack>
  );
}
