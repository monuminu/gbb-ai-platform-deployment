import { useMemo, useState, useEffect, useCallback } from 'react';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';

import {
  removeStorage,
  AOAI_CREDENTIAL_KEY,
  AOAI_STORAGE_CONFIG,
} from 'src/hooks/use-local-storage';

import { axiosClientInstance } from 'src/utils/axios';

// import { msalInstance } from 'src/main';

import { msalInstance, loginRequest } from 'src/authConfig';

import { AuthContext } from './auth-context';
import { setSession, getTokenFromServer } from './utils';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

function AuthProviderWrapper({ children }: Props) {
  // const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [imageUrl, setImageUrl] = useState('');
  const [popupClick, setPopupClick] = useState(false);

  // LOGIN
  const handleLoginWithPopup = useCallback(async () => {
    try {
      setPopupClick(true);
      const res = await msalInstance.loginPopup(loginRequest);

      if (res.accessToken) {
        const token = await getTokenFromServer(`Bearer ${res.accessToken}`);
        // console.log(result);
        setSession(token);
      }
      setPopupClick(false);
    } catch (e) {
      setPopupClick(false);
      console.error(e);
    }
  }, []);

  // LOGOUT
  const handleLogoutWithPopup = useCallback(async () => {
    msalInstance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/',
    });
    removeStorage(STORAGE_KEY);
    removeStorage(AOAI_CREDENTIAL_KEY);
    removeStorage(AOAI_STORAGE_CONFIG);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      if (accessToken) setSession(accessToken);
      else {
        handleLoginWithPopup();
      }

      const fetchUserPhoto = async () => {
        const res = await axiosClientInstance.get(
          `https://graph.microsoft.com/v1.0/me/photos/96x96/$value`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([res.data], { type: 'image/jpeg' });
        const _imageUrl = URL.createObjectURL(blob);
        setImageUrl(_imageUrl);
      };
      fetchUserPhoto();
    } else {
      setImageUrl('');
    }
  }, [isAuthenticated, handleLoginWithPopup, handleLogoutWithPopup]);

  // const handleLoginWithPopup = () => {
  //   instance.loginPopup(loginRequest).catch((e) => {
  //     console.log(e);
  //   });
  // };

  // const handleLogoutWithPopup = () => {
  //   instance.logoutPopup({
  //     postLogoutRedirectUri: '/',
  //     mainWindowRedirectUri: '/',
  //   });
  // };

  // const status = popupClick ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated';

  let status = 'unauthenticated';
  if (popupClick) {
    status = 'loading';
  } else if (isAuthenticated) {
    status = 'authenticated';
  }

  const user = msalInstance.getAllAccounts()[0] || null;

  const memoizedValue = useMemo(
    () => ({
      user: {
        ...user,
        displayName: user?.name,
        photoURL: imageUrl || '',
        role: user?.username === 'xle@microsoft.com' ? 'admin' : 'user',
      },
      method: 'ad',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      loginWithPopup: handleLoginWithPopup,
      logout: handleLogoutWithPopup,
    }),
    [user, status, imageUrl, handleLoginWithPopup, handleLogoutWithPopup]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

// ----------------------------------------------------------------------

export const AuthProvider = ({ children }: Props) => (
  <MsalProvider instance={msalInstance}>
    <AuthProviderWrapper>{children}</AuthProviderWrapper>
  </MsalProvider>
);
