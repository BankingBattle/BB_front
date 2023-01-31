import { makeApi } from '@zodios/core';
import { z } from 'zod';

export const submitRequest = z.object({
  file: z.string(),
  id_command: z.number(),
  round_num: z.number(),
})

export const submitResponse = z.object({
  response_data: submitRequest,
})

export const submitApi = makeApi([
  {
    method: 'post',
    path: '/submit/upload/',
    alias: 'submit',
    response: submitResponse,
    parameters: [
      {
        name: 'submit_request',
        schema: submitRequest,
        type: 'Body',
      },
    ],
  },
]);
