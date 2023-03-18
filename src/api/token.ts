import { ZodiosPlugin } from '@zodios/core';
import axios, { AxiosError } from 'axios';
import { api } from '.';

function isTokenRenewed(newToken: string | undefined, error: AxiosError) {
  if (!(newToken && error.config?.headers)) {
    return false;
  }
  const oldCredentials = error.config.headers['Authorization'] as string;
  return !oldCredentials.includes(newToken);
}

export const tokenPlugin: ZodiosPlugin = {
  request: async (_api, config) => {
    const token = localStorage.getItem('access') ?? undefined;

    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return config;
  },
  error: async (_api, config, error) => {
    if (
      !config.url?.startsWith('/token/') &&
      axios.isAxiosError(error) &&
      error.config &&
      error.response?.status === 401
    ) {
      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        throw error;
      }

      const token = await api.refresh({ refresh });

      localStorage.setItem('access', token.access);

      if (isTokenRenewed(token.access, error)) {
        const retryConfig = { ...error.config };
        retryConfig.headers.set('Authorization', `Bearer ${token.access}`);
        return axios(retryConfig);
      }
    }

    throw error;
  },
};
