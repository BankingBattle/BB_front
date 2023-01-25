import { useTranslation } from 'react-i18next';
import {
  Form,
  ActionFunctionArgs,
  redirect,
  useActionData,
} from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import Balancer from 'react-wrap-balancer';

import { isErrorFromAlias } from '@zodios/core';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';
import { RegisterError, registerSchema } from '../schemas';
import { A } from '../components/A';

export async function action({ request }: ActionFunctionArgs) {
  const data = registerSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    await queryClient.fetchQuery({
      queryFn: () => api.register(data.data),
      queryKey: query.getKeyByAlias('me'),
    });
  } catch (rawError) {
    if (isErrorFromAlias(api.api, 'register', rawError)) {
      const error = rawError as ZodiosMatchingErrorsByAlias<
        typeof api.api,
        'register'
      >;

      if (error.response.status === 400) {
        return error.response.data as RegisterError;
      }
    }

    return { _errors: ['Unknown error'] };
  }

  return redirect('/profile');
}

function Register() {
  const errors = (useActionData() || {}) as FormError<typeof action>;
  const { t } = useTranslation();

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">
        <Balancer>{t('Register for Banking Battle')}</Balancer>
      </h1>
      <Form
        method="post"
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >
        {'_errors' in errors &&
          errors._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <fieldset className="flex flex-col lg:flex-row w-full">
          <label htmlFor="first_name" className="w-full m-1">
            {t('First name')}
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder={t('Your first name')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>

          <label htmlFor="last_name" className="w-full m-1">
            {t('Last name')}
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder={t('Your last name')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>
        </fieldset>

        <label htmlFor="login" className="w-full m-1">
          {t('Login')}
          <span className="text-red-500 inline"> *</span>
          <input
            required
            type="text"
            id="login"
            name="login"
            placeholder={t('Enter nickname')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        {'login' in errors &&
          errors.login?._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <label htmlFor="email" className="w-full m-1">
          {t('Email')}
          <span className="text-red-500 inline"> *</span>
          <input
            required
            type="text"
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
          <span className="text-red-500 inline"> *</span>
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder={t('Password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        {'password' in errors &&
          errors.password?._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <label htmlFor="confirm_password" className="w-full m-1">
          {t('Confirm password')}
          <span className="text-red-500 inline"> *</span>
          <input
            required
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder={t('Confirm password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        {'confirm_password' in errors &&
          errors.confirm_password?._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <button
          type="submit"
          className="lg:w-96 w-full my-8 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {t('Sign up')}
        </button>
      </Form>
      <div className="text-center">
        {t('Already have an account? ')}
        <A to="/login">{t('Log in')}</A>
      </div>
    </>
  );
}

export default Register;
