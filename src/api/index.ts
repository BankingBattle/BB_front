import { makeApi, Zodios } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { userApi } from './user';
import { gameApi } from './game';

const apiDefinition = makeApi([...userApi, ...gameApi]);

export const api = new Zodios(import.meta.env.VITE_API_ENDPOINT, apiDefinition);

api.axios.interceptors.request.use(
  async (config) => {
    const access = localStorage.getItem('access');

    if (access) {
      config.headers.set('authorization', `Bearer ${access}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.axios.interceptors.response.use(
  (response) => {
    if (
      !response.config.url?.startsWith('/token/') &&
      response.data.success &&
      response.data.response_data
    ) {
      response.data = response.data.response_data;
    }
    return response;
  },
  async (error) => {
    const config = error?.config;
    if (
      config &&
      !config.sent &&
      !config.url?.startsWith('/token/') &&
      error.response.status === 401
    ) {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        throw error;
      }
      config.sent = true;
      const token = await api.refresh({ refresh });
      localStorage.setItem('access', token.access);
      return api.axios(config);
    }
    throw error;
  }
);

export const query = new ZodiosHooks('api', api);
