import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { createRoundSchema } from '../../schemas';

const leaderboard = z
  .object({
    id: z.number(),
    name: z.string(),
    place: z.number().int(),
    points: z.number(),
    is_current_team: z.boolean(),
  })
  .array();

const rounds = z
  .object({
    id: z.number(),
    name: z.string(),
    datetime_start: z.string().datetime(),
    datetime_end: z.string().datetime(),
  })
  .array();

export const game = z.object({
  name: z.string(),
  description: z.string(),
  rounds: rounds,
  leaderboard: leaderboard,
});

export const getGameResponse = z.object({
  response_data: game
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
  message: z.string(),
  response_data: createRoundSchema.extend({
    is_active: z.boolean()
  }).nullable()
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
    ]
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
    ]
  },
]);
