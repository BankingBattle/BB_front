import { makeApi, Zodios } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { tokenPlugin } from './token';
import { extractPlugin } from './extract';
import { userApi } from './user';
import { gameApi } from './game';
import { roundApi } from './round';

const apiDefinition = makeApi([...userApi, ...gameApi, ...roundApi]);

export const api = new Zodios(import.meta.env.VITE_API_ENDPOINT, apiDefinition);

api.use(extractPlugin);
api.use(tokenPlugin);

export const query = new ZodiosHooks('api', api);
