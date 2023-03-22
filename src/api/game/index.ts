import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { createGameError } from './errors';
import { round } from '../round';

const leaderboard = z
  .object({
    id: z.number(),
    name: z.string(),
    place: z.number().int(),
    points: z.number(),
    is_current_team: z.boolean(),
  })
  .array();

export const game = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  is_current_team: z.boolean().optional(),
  leaderboard: leaderboard.optional(),
  rounds: round.array().optional(),
});

export type Game = z.infer<typeof game>;

export const updateGameRequest = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  datetime_start: z.string().optional(),
  datetime_end: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const createGameRequest = z.object({
  name: z.string(),
  description: z.string(),
});

export const gameApi = makeApi([
  {
    method: 'get',
    path: '/game/',
    alias: 'games',
    response: z.array(game),
  },
  {
    method: 'get',
    path: '/game/:id',
    alias: 'game',
    response: game,
  },
  {
    method: 'patch',
    path: '/game/:id',
    alias: 'patch_game',
    response: game,
    parameters: [
      {
        name: 'update_game_request',
        schema: updateGameRequest,
        type: 'Body',
      },
    ],
  },
  {
    method: 'post',
    path: '/game/',
    alias: 'create_game',
    response: game,
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
]);
