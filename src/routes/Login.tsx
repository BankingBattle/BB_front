import { useTranslation } from 'react-i18next';
import { Form, ActionFunctionArgs, redirect, NavLink } from 'react-router-dom';
import { z } from 'zod';
import { api, login, query } from '../api';
import { queryClient } from '../main';

type Token = {
  refresh: string;
  access: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData()) as z.infer<
    typeof login
  >;

  try {
    const { access, refresh } = await queryClient.fetchQuery({
      queryFn: () => api.login(data),
      queryKey: query.getKeyByAlias('login'),
    });

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  } catch (error) {
    console.log(error);
  }

  redirect('/');
}

function Login() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/2 font-semibold text-center">
        {t('Log in to Banking Battle')}
      </h1>
      <Form
        method="post"
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >
        <label htmlFor="email" className="w-full m-1">
          {t('Email')}
          <input
            type="text"
            name="email"
            id="email"
            placeholder={t('Enter your e-mail')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <label htmlFor="password" className="w-full m-1">
          {t('Password')}
          <input
            type="password"
            name="password"
            placeholder={t('Password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <button
          type="submit"
          className="lg:w-96 w-full mt-8 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {t('Log in')}
        </button>
        <NavLink to="/restore">{t('Forgot password?')}</NavLink>
      </Form>
      <div className="text-center mt-8">
        {t("Don't have an account? ")}
        <NavLink to="/register">{t('Sign up')}</NavLink>
      </div>
    </>
  );
}

export default Login;
