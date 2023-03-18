import { z } from 'zod';
import { round } from '../game';

export const createRoundError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof round>, string> => {
      return { _errors: [message] };
    }
  );