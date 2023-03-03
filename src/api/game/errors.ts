import { z } from 'zod';
import { game } from '.';

export const createGameError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof game>, string> => {
      return { _errors: [message] };
    }
  );
