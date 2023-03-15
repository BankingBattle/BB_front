import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { createRoundSchema } from '../../schemas';
import { createGameError, createRoundError } from './errors';

const leaderboard = z.object({
    id: z.number(),
    name: z.string(),
    place: z.number().int(),
    points: z.number(),
    is_current_team: z.boolean(),
});

export const round = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    datetime_start: z.string().datetime(),
    datetime_end: z.string().datetime(),
});

export const roundUploadRequest = z.object({
  file: z.any(),
  round_id: z.number()
})

export const roundUploadResponse = z.object({
  message: z.string().optional(),
  response_data: z.string().optional()
})


export const game = z.object({
  name: z.string(),
  description: z.string(),
  rounds: round.array(),
  leaderboard: leaderboard.array(),
});

export const updateGameRequest = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  datetime_start: z.string().optional(),
  datetime_end: z.string().optional(),
  is_active: z.boolean().optional()
})

export const getGameResponse = z.object({
  message: z.string().optional(),
  response_data: game.optional()
})

export const getRoundResponse = z.object({
  message: z.string().optional(),
  response_data: round.extend({
    is_active: z.boolean(),
    game_id: z.number(),
  }).optional()
})


export const createGameRequest = z.object({
  name: z.string(),
  description: z.string(),
})

export const createGameResponse = z.object({
  message: z.string().optional(),
  response_data: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string()
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

export const gameApi = makeApi([
  {
    method: 'get',
    path: '/game/',
    alias: 'games',
    response: game.array(),
  },
  {
    method: 'get',
    path: '/game/:id',
    alias: 'game',
    response: getGameResponse,
  },
  {
    method: 'patch',
    path: '/game/:id',
    alias: 'patch_game',
    response: getGameResponse,
    parameters: [
      {
        name: 'update_game_request',
        schema: updateGameRequest,
        type: 'Body'
      }
    ]
  },
  {
    method: 'get',
    path: '/round/:id',
    alias: 'round',
    response: getRoundResponse,
  },
  {
    method: 'put',
    path: '/round/uploud_data/:id',
    alias: 'upload_data',
    response: roundUploadResponse,
    parameters: [
      {
        name: 'upload_data_request',
        schema: roundUploadRequest,
        type: 'Body',
      }
    ]
  },
  {
    method: 'post',
    path: '/game/',
    alias: 'create_game',
    response: createGameResponse,
    parameters: [
      {
        name: 'create_game_request',
        schema: createGameRequest,
        type: 'Body',
      },
    ],
    errors: [
      {
        status: 400,
        description: 'Create game error',
        schema: createGameError,
      },
    ],
  },
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
]);
