// import { shallowEqual } from 'react-redux';
// import { useEffect, useState } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Avatar,
  Skeleton,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
// hooks
// import { useAuthContext } from 'src/auth/hooks';
// import { getUserList } from "../../../../../redux/slices/helper";
// import { RootState, useDispatch, useSelector } from "../../../../../redux/store";
// @types
import { Maintainer } from 'src/types/user';
// utils
// import permissionAllowed from "../../../../../utils/checkPermission";
// component
import Iconify from 'src/components/iconify';
// import SearchNotFound from "../../../../SearchNotFound";

import EmptyContent from 'src/components/empty-content';
// import PermissionDenied from "../../PermissionDenied";

// ----------------------------------------------------------------------

type Props = {
  query: string;
  setQuery: Function;
  onAddMaintainer: Function;
  maintainers: Maintainer[];
};

export default function MlAppMaintainersSection({
  // query,
  setQuery,
  // onAddMaintainer,
  maintainers,
}: Props) {
  // const { user } = useAuthContext();

  // const dispatch = useDispatch();

  // const [allowToGetUsers, setAllowToGetUsers] = useState(
  //   permissionAllowed(user, 'datastore:GetMaintainers')
  // );

  // // const { enqueueSnackbar } = useSnackbar();

  // const isLoadingUserList = useSelector(
  //   (state: RootState) => state.helper.isLoadingUsers,
  //   shallowEqual
  // );

  // const userList = useSelector((state: RootState) => state.helper.userList, shallowEqual);
  const userList: Maintainer[] = [];
  const isLoadingUserList = false;
  const allowToGetUsers = true;
  // useEffect(() => {
  // if (permissionAllowed(user, 'datastore:GetMaintainers')) {
  //   if (userList.length === 0) {
  //     dispatch(getUserList());
  //   }
  // }
  // setAllowToGetUsers(permissionAllowed(user, 'datastore:GetMaintainers'));
  // else
  //   enqueueSnackbar("Permission denied to get users", {
  //     variant: "error",
  //   });
  // }, [dispatch, user, userList.length]);

  const handleChangeValues = (newMaintainers: Maintainer[]) => {
    // const newMaintainersWithPermission = newMaintainers.map((maintainer) => {
    //   if (maintainer.permission === undefined) return { ...maintainer, permission: 'view' };
    //   return { ...maintainer };
    // });
    // onAddMaintainer(newMaintainersWithPermission);
  };

  return (
    <Autocomplete
      multiple
      size="medium"
      limitTags={2}
      fullWidth
      popupIcon={null}
      noOptionsText={
        // <SearchNotFound searchQuery={query} type={"permissionDenied"} />
        <EmptyContent filled title="No Data" sx={{ py: 10 }} />
      }
      onChange={(event, value) => handleChangeValues(value)}
      onInputChange={(event, value) => setQuery(value)}
      options={userList}
      value={maintainers}
      getOptionLabel={(maintainer: Maintainer) => maintainer.email}
      isOptionEqualToValue={(option, value) => option.email === value.email}
      renderOption={(props, maintainer: Maintainer, { inputValue, selected }) => {
        const { name, email, avatar } = maintainer;
        const matches = match(email, inputValue);
        const parts = parse(email, matches);
        // console.log(parts);
        return (
          <Box component="li" sx={{ p: '8px !important' }} {...props}>
            {isLoadingUserList && (
              <Stack direction="row" spacing={2} sx={{ p: 1, my: 1.5 }}>
                <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 12 }} />
                <Skeleton
                  variant="rectangular"
                  width="90%"
                  height={24}
                  sx={{ borderRadius: 2, mt: 1, mb: 1 }}
                />
              </Stack>
            )}
            {!isLoadingUserList && allowToGetUsers && (
              <>
                <Box
                  sx={{
                    mr: 1.5,
                    width: 32,
                    height: 32,
                    overflow: 'hidden',
                    borderRadius: '50%',
                    position: 'relative',
                  }}
                >
                  <Avatar alt={name} src={avatar} sx={{ width: 32, height: 32 }} />
                  <Box
                    sx={{
                      top: 0,
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.6),
                      transition: (theme) =>
                        theme.transitions.create('opacity', {
                          easing: theme.transitions.easing.easeInOut,
                          duration: theme.transitions.duration.shorter,
                        }),
                      ...(selected && {
                        opacity: 1,
                        color: 'primary.main',
                      }),
                    }}
                  >
                    <Iconify icon={checkmarkFill} />
                  </Box>
                </Box>

                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    variant="subtitle2"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                  >
                    {part.text}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        );
      }}
      renderTags={(_maintainers, getTagProps) =>
        _maintainers.map((maintainer, index) => {
          const { name, email, avatar } = maintainer;
          return (
            <Chip
              {...getTagProps({ index })}
              key={email}
              size="small"
              label={name}
              variant="soft"
              avatar={<Avatar alt={name} src={avatar} />}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          label=""
          {...params}
          placeholder="#Add maintainers"
          // sx={{
          //   "& .MuiInputBase-root": {
          //     py: "4px",
          //   },
          // }}
        />
      )}
    />
  );
}
