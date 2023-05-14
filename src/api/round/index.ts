import { z } from 'zod';
import { createRoundSchema } from '../../schemas';
import { makeApi } from '@zodios/core';
import { createRoundError } from './errors';

export const round = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  game_id: z.number().optional(),
  description: z.string().optional(),
  datetime_start: z.string().datetime().nullable(),
  datetime_end: z.string().datetime().nullable(),
  is_active: z.boolean().optional(),
});

export type Round = z.infer<typeof round>;

export const roundUploadResponse = z.string().optional();

export const createRoundResponse = round.extend({
    message: z.string().optional()
});

export const roundUploadRequest = z.object({
  file: z.instanceof(File),
  round_id: z.number(),
});

export const roundApi = makeApi([
  // get round
  {
    method: 'get',
    path: '/round/:id/',
    alias: 'round',
    response: round,
  },

  // get round data
  {
    method: 'get',
    path: '/round/data/:id/',
    alias: 'roundData',
    response: z
      .string()
      .or(z.object({}))
      .transform((data) => {
        if (typeof data === 'string') {
          return data;
        }
        return null;
      }),
  },

  // upload round data
  {
    method: 'put',
    path: '/round/uploud_data/:id/',
    alias: 'uploadData',
    response: roundUploadResponse,
    requestFormat: 'form-data',
    parameters: [
      {
        name: 'upload_data_request',
        schema: roundUploadRequest,
        type: 'Body',
      },
    ],
  },

  // create round
  {
    method: 'post',
    path: '/round/create/',
    alias: 'createRound',
    response: createRoundResponse,
    parameters: [
      {
        name: 'create_round_request',
        schema: createRoundSchema,
        type: 'Body',
      },
    ],
    errors: [
      {
        status: 400,
        description: 'Create round error',
        schema: createRoundError,
      },
    ],
  },
]);
