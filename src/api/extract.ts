import { ZodiosError, ZodiosPlugin } from '@zodios/core';

export const extractPlugin: ZodiosPlugin = {
  response: async (_api, config, response) => {
    if (config.url?.startsWith('/token/')) {
      return response;
    }
    if (response.data.success === false) {
      throw new ZodiosError(
        response.data.message,
        config,
        response.data,
        response.data
      );
    }
    if (response.data.response_data) {
      response.data = response.data.response_data;
    }
    return response;
  },
};
