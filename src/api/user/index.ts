import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { registerError } from './errors';

export const login = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const user = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  login: z.string().min(3, { message: 'Login must be 3 or more characters' }),
});

export const register = login.merge(user).extend({
  admin_key: z.string(),
});

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

export const userApi = makeApi([
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
    errors: [
      {
        status: 400,
        description: 'Register error',
        schema: registerError,
      },
    ],
  },
  {
    method: 'patch',
    path: '/user/me/',
    alias: 'update',
    parameters: [
      {
        name: 'update',
        schema: z
          .object({
            email: z.string().email(),
            first_name: z.string(),
            last_name: z.string(),
            password: z.string(),
          })
          .partial(),
        type: 'Body',
      },
    ],
    response: user.omit({ login: true }),
    errors: [
      {
        status: 400,
        description: 'Update data error',
        schema: registerError,
      },
    ],
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
    errors: [
      {
        status: 401,
        description: 'Login error',
        schema: z.object({ detail: z.string() }),
      },
    ],
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
        schema: z.object({ detail: z.string() }),
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
