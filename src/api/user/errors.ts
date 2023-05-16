import { z } from 'zod';
import { register } from '.';
import { game } from '../game';
import { createTeamSchema } from '../../schemas';

export const createTeamError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof createTeamSchema>, string> => {
      return { _errors: [message] };
    }
  );

export const registerError = z
  .object({ message: z.string() })
  .transform(
    ({ message }): z.ZodFormattedError<z.infer<typeof register>, string> => {
      const isLoginExistsError = message.match(
        /User with login (\S+) already exists/
      );

      if (isLoginExistsError) {
        return { login: { _errors: ['Login already exists'] }, _errors: [] };
      }

      const isEmailExistsError = message.match(
        /User with email (\S+) already exists/
      );

      if (isEmailExistsError) {
        return {
          email: { _errors: ['Email already exists'] },
          _errors: [],
        };
      }

      const isEmailNotValidError = message.match(
        /Registration failed: email (\S+) is not valid./
      );

      if (isEmailNotValidError) {
        return {
          email: { _errors: ['Invalid email'] },
          _errors: [],
        };
      }

      return { _errors: ['Unknown error'] };
    }
  );
