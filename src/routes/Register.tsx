import { useTranslation } from 'react-i18next';
import { Form, ActionFunctionArgs, NavLink, redirect } from 'react-router-dom';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const query = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    login: formData.get('login'),
    password: formData.get('password'),
  } as const;

  const result = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/register`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(request => request.json());

  console.log(result);

  redirect('/');
}

function Register() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">{t('Register for Banking Battle')}</h1>
      <Form
        method="post"
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >
        <fieldset className="flex flex-col lg:flex-row w-full">
          <label htmlFor="first_name" className="w-full m-1">
            {t('First name')}
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder={t('Your first name')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>
          <label htmlFor="last_name" className="w-full m-1">
            {t('Last name')}
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder={t('Your last name')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>
        </fieldset>
        <label htmlFor="login" className="w-full m-1">
          {t('Login')}<span className="text-red-500 inline"> *</span>
          <input
            required
            type="text"
            name="login"
            id="login"
            placeholder={t('Enter nickname')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <label htmlFor="email" className="w-full m-1">
          {t('Email')}<span className="text-red-500 inline"> *</span>
          <input
            required
            type="text"
            name="email"
            id="email"
            placeholder={t('Enter your e-mail')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <label htmlFor="password" className="w-full m-1">
          {t('Password')}<span className="text-red-500 inline"> *</span>
          <input
            required
            type="password"
            name="password"
            placeholder={t('Password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <label htmlFor="confirm_password" className="w-full m-1">
          {t('Confirm password')}<span className="text-red-500 inline"> *</span>
          <input
            required
            type="password"
            name="confirm_password"
            placeholder={t('Confirm password')}
            className="block w-full bg-white border-gray-100 border-2"
          />
        </label>
        <button type="submit" className="lg:w-96 w-full my-8 bg-purple-500 hover:bg-purple-600 text-white">
          {t('Sign up')}
        </button>
      </Form>
      <div className="text-center">
        {t('Already have an account? ')}<NavLink to="/login">{t('Log in')}</NavLink>
      </div>
    </>
  );
}

export default Register;
