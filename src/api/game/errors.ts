import { z } from 'zod';
import { game, round } from '.';

export const createGameError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof game>, string> => {
      return { _errors: [message] };
    }
  );

export const createRoundError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof round>, string> => {
      return { _errors: [message] };
    }
  );
