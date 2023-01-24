import { makeApi } from '@zodios/core';
import { z } from 'zod';

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
]);
