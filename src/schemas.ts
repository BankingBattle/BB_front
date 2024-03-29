import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export const createTeamSchema = z.object({
  name: z.string().min(1).max(63)
})

export const createRoundSchema = z.object({
  game_id: z.string(),
  name: z.string(),
  description: z.string(),
  datetime_start: z.string(),
  datetime_end: z.string(),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    login: z.string().min(3, { message: 'Login must be 3 or more characters' }),
    password: z
      .string()
      .min(8, { message: 'Password must be 8 or more characters' }),
    confirm_password: z.string(),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  });

export type CreateGameError = z.ZodFormattedError<
  z.infer<typeof createGameSchema>,
  string
>;

export type CreateTeamError = z.ZodFormattedError<
  z.infer<typeof createTeamSchema>,
  string
>

export type CreateRoundError = z.ZodFormattedError<
  z.infer<typeof createRoundSchema>,
  string
>;

export type RegisterError = z.ZodFormattedError<
  z.infer<typeof registerSchema>,
  string
>;

export const changeDataSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    login: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .partial()
  .refine(
    ({ password = '', confirm_password = '' }) => password === confirm_password,
    {
      message: 'Passwords must match',
      path: ['confirm_password'],
    }
  )
  .refine(({ login }) => !login || login.length >= 3, {
    message: 'Login must be 3 or more characters',
    path: ['login'],
  })
  .refine(({ password }) => !password || password.length >= 8, {
    message: 'Password must be 8 or more characters',
    path: ['password'],
  });
