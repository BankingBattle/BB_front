import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { register } from '../user';

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


export const createGameRequest = z.object({
  name: z.string(),
  description: z.string(),
})

export const createGameResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
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
    response: game,
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
  }
]);
