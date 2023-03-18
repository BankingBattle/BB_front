import { z } from 'zod';
import { createRoundSchema } from '../../schemas';
import { makeApi } from '@zodios/core';
import { createRoundError } from '../game/errors';
import { zfd } from "zod-form-data";

export const round = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  datetime_start: z.string().datetime(),
  datetime_end: z.string().datetime(),
});

export const roundUploadResponse = z.object({
  message: z.string().optional(),
  response_data: z.any().optional()
})

export const getRoundResponse = z.object({
  message: z.string().optional(),
  response_data: round.extend({
    is_active: z.boolean(),
    game_id: z.number(),
  }).optional()
});

export const createRoundRequest = createRoundSchema;

export const createRoundResponse = z.object({
  game_id: z.number(),
  name: z.string(),
  description: z.string(),
  datetime_start: z.string(),
  datetime_end: z.string(),
  is_active: z.boolean()
});

export const roundUploadRequest = zfd.formData({
  file: zfd.file(),
  round_id: zfd.numeric(),
})

export const roundNoDataResponse = z.object({
  message: z.string(),
});


export const roundApi = makeApi([
  // get round
  {
    method: 'get',
    path: '/round/:id',
    alias: 'round',
    response: getRoundResponse,
  },

  // get round data
  {
    method: 'get',
    path: '/round/data/:id',
    alias: 'round_data',
    response: roundNoDataResponse
  },

  // upload round data
  {
    method: 'put',
    path: '/round/uploud_data/:id/',
    alias: 'upload_data',
    response: roundUploadResponse,
    requestFormat: 'form-data',
    parameters: [
      {
        name: 'upload_data_request',
        schema: roundUploadRequest,
        type: 'Body',
      }
    ],

  },

  // create round
  {
    method: 'post',
    path: '/round/create/',
    alias: 'create_round',
    response: createRoundResponse,
    parameters: [
      {
        name: 'create_round_request',
        schema: createRoundRequest,
        type: 'Body',
      }
    ],
    errors: [
      {
        status: 400,
        description: 'Create round error',
        schema: createRoundError,
      },
    ],
  },
])