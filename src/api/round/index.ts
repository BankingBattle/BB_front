import { makeApi } from '@zodios/core';
import { z } from 'zod';

const round = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  datetime_start: z.string().datetime(),
  datetime_end: z.string().datetime(),
  is_active: z.boolean(),
  game_id: z.number()
});


export const roundApi = makeApi([
  {
    method: 'get',
    path: '/round/:id',
    alias: 'round',
    response: round
  },
]);
