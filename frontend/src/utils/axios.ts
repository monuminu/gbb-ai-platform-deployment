import axios, { AxiosRequestConfig } from 'axios';

import { BACKEND_API } from 'src/config-global';
import { msalConfig, loginRequest, msalInstance } from 'src/authConfig';

// ----------------------------------------------------------------------

export async function getToken(): Promise<string> {
  const currentAccount = msalInstance.getAllAccounts()[0];

  if (currentAccount && currentAccount.idTokenClaims) {
    if (currentAccount.idTokenClaims.aud === msalConfig.auth.clientId) {
      const accessTokenRequest = {
        ...loginRequest,
        account: currentAccount,
      };
      const accessTokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
      return `Bearer ${accessTokenResponse.accessToken}`;
      // const roles = (currentAccount.idTokenClaims as { [key: string]: any }).roles;
      // if (roles) {
      //   const intersection = Object.keys(appRoles).filter((role) => roles.includes(role));
      //   if (intersection.length > 0) {
      //     const accessTokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
      //     return `Bearer ${accessTokenResponse.accessToken}`;
      //   }
      // }
    }
    return '';
  }
  throw new Error('No active account found');
}

// ----------------------------------------------------------------------

const axiosClientInstance = axios.create();

axiosClientInstance.interceptors.request.use(async (config) => {
  const bearer = await getToken();
  config.headers.Authorization = bearer;
  return config;
});

export { axiosClientInstance };

// ----------------------------------------------------------------------

const axiosApiInstance = axios.create({ baseURL: BACKEND_API });

// axiosInstance.interceptors.request.use(async (config) => {
//   // const bearer = await getToken();
//   const bearer = localStorage.getItem('accessToken');
//   config.headers.Authorization = bearer;
//   return config;
// });

axiosApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response && error.response.data ? error.response.data : 'An unexpected error occurred';
    return Promise.reject(errorMessage);
  }
);

export default axiosApiInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosApiInstance.get(url, { ...config });

  return res.data;
};

export const fetcherBlob = async (url: string) => {
  const response = await axiosApiInstance.get(url, { responseType: 'blob' });

  if (response.status !== 200) {
    throw new Error('An error occurred while fetching the data.');
  }

  const newBlob = new Blob([response.data], { type: 'image/jpeg' });

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(newBlob);
  });
};

export const fetcherWithRefreshKey = async (
  args: [string, number] | [string, number, AxiosRequestConfig]
) => {
  const [url, refreshKey, config] = args;

  const res = await axiosApiInstance.get(`${url}?refreshKey=${refreshKey}`, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    token: '/get_token',
    login: '/api/account/login',
  },
  app: {
    list: '/apps',
    customGpt: {
      list: '/apps/custom-gpt',
      create: '/apps/custom-gpt/create',
      delete: '/apps/custom-gpt/delete',
      sas: '/apps/custom-gpt/sas',
    },
  },
  kmm: {
    root: '/kmm',
    list: '/kmm/list',
    kb: '/kmm/kb',
    create: '/kmm/kb/create',
    sources: '/kmm/sources',
  },
  tool: {
    list: '/tools',
    create: '/tools/create',
    delete: '/tools/delete',
    deploy: '/tools/deploy',
    sas: '/tools/sas',
  },
  documentation: {
    root: '/documentation',
    faqs: '/documentation/faqs',
    contents: '/documentation/contents',
  },
};
