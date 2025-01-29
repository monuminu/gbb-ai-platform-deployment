import { paths } from 'src/routes/paths';

import axios, { getToken, endpoints } from 'src/utils/axios';

import { AD_CLIENT_ID } from 'src/config-global';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const getTokenFromServer = async (accessToken: string) => {
  const response = await axios.get(`${endpoints.auth.token}/${AD_CLIENT_ID}`, {
    headers: { Authorization: accessToken },
  });

  if (response.status === 200 && response.data) {
    return response.data;
  }
  alert('Unable to acquire token: Authentication process failed.');
  return null;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = paths.auth.ad.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

const handleAccessTokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(async () => {
    localStorage.removeItem('accessToken');

    try {
      console.log('Reach token expiration');
      const clientToken = await getToken();
      const accessToken = await getTokenFromServer(clientToken);
      setSession(accessToken);
    } catch (error: any) {
      alert(error.message);
      localStorage.removeItem('accessToken');
      window.location.href = paths.auth.ad.login;
    }
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  // console.log(accessToken);
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken);
    // tokenExpired(exp);
    handleAccessTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    // alert('Token expired');
    window.location.href = paths.auth.ad.login;
    delete axios.defaults.headers.common.Authorization;
  }
};
