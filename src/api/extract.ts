import { ZodiosPlugin } from '@zodios/core';

export const extractPlugin: ZodiosPlugin = {
  response: async (_api, config, response) => {
    if (!config.url?.startsWith('/token/') && response.data.response_data) {
      response.data = response.data.response_data;
    }
    return response;
  },
};
