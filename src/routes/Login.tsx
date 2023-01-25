import { useTranslation } from 'react-i18next';
import {
  Form,
  ActionFunctionArgs,
  redirect,
  useActionData,
} from 'react-router-dom';
import Balancer from 'react-wrap-balancer';
import { z } from 'zod';
import { api, query } from '../api';
import { queryClient } from '../main';
import { isErrorFromAlias } from '@zodios/core';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';
import { A } from '../components/A';

export const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be 8 or more characters' }),
});

type Error = z.ZodFormattedError<z.infer<typeof formSchema>, string>;

export async function action({ request }: ActionFunctionArgs) {
  const data = formSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    const { access, refresh } = await queryClient.fetchQuery({
      queryFn: () => api.login(data.data),
      queryKey: query.getKeyByAlias('login'),
    });

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  } catch (rawError) {
    if (isErrorFromAlias(api.api, 'login', rawError)) {
      const error = rawError as ZodiosMatchingErrorsByAlias<
        typeof api.api,
        'login'
      >;

      if (error.response.status === 401) {
        const data = error.response.data;
        return { _errors: [data.detail] } satisfies Error;
      }
    }

    return { _errors: ['Unknown error'] } satisfies Error;
  }

  return redirect('/');
}

function Login() {
  const errors = (useActionData() as FormError<typeof action>) || {};
  const { t } = useTranslation();

  return (
    <div className="lg:w-1/2 w-full">
      <h1 className="lg:text-5xl self-center font-semibold text-center">
        <Balancer>{t('Log in to Banking Battle')}</Balancer>
      </h1>
      <Form method="post" className="mx-auto p-5 flex flex-col items-center">
        <label htmlFor="email" className="w-full m-1">
          {t('Email')}
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder={t('Enter your e-mail')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        {'email' in errors &&
          errors.email?._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <label htmlFor="password" className="w-full m-1">
          {t('Password')}
          <input
            required
            type="password"
            name="password"
            placeholder={t('Password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        {'password' in errors &&
          errors.password?._errors.map((error) => (
            <p className="text-red-600">{t(error)}</p>
          ))}

        {'_errors' in errors &&
          errors._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <button
          type="submit"
          className="mx-1 my-1 px-3 py-2 rounded-md transition-colors lg:w-96 w-full mt-8 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {t('Log in')}
        </button>
        <A to="/restore">{t('Forgot password?')}</A>
      </Form>
      <div className="text-center mt-8">
        {t("Don't have an account? ")}
        <A to="/register">{t('Sign up')}</A>
      </div>
    </div>
  );
}

export default Login;
