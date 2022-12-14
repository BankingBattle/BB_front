import { makeApi, Zodios } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { z } from 'zod';

export const login = z.object({
  email: z.string().email(),
  password: z.string(),
});

const user = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  login: z.string(),
});

export const register = login.merge(user);

const refresh = z.object({
  refresh: z.string(),
});

const access = z.object({
  access: z.string(),
});

const verify = z.object({
  token: z.string(), // access
});

const token = access.merge(refresh);

const error = z.object({
  code: z.string(),
});

export const apiDefinition = makeApi([
  {
    method: 'post',
    path: '/register/',
    alias: 'register',
    parameters: [
      {
        name: 'register',
        schema: register,
        type: 'Body',
      },
    ],
    response: user,
  },
  {
    method: 'post',
    path: '/token/',
    alias: 'login',
    parameters: [
      {
        name: 'login',
        schema: login,
        type: 'Body',
      },
    ],
    response: token,
  },
  {
    method: 'post',
    path: '/token/verify/',
    alias: 'verify',
    parameters: [
      {
        name: 'verify',
        schema: verify,
        type: 'Body',
      },
    ],
    response: z.object({}),
    errors: [
      {
        status: 401,
        description: 'Invalid token',
        schema: error,
      },
    ],
  },
  {
    method: 'post',
    path: '/token/refresh/',
    alias: 'refresh',
    parameters: [
      {
        name: 'refresh',
        schema: refresh,
        type: 'Body',
      },
    ],
    response: access,
  },
  {
    method: 'get',
    path: '/user/me/',
    alias: 'me',
    response: user,
  },
]);

export const api = new Zodios(import.meta.env.VITE_API_ENDPOINT, apiDefinition);

api.axios.interceptors.request.use(
  async (config) => {
    const access = localStorage.getItem('access');

    if (access) {
      config.headers = {
        authorization: `Bearer ${access}`,
      };
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
