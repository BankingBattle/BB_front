import { useTranslation } from 'react-i18next';
import { Form, ActionFunctionArgs, redirect } from 'react-router-dom';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  alert(
    `Login: ${formData.get('login')}\nEmail: ${formData.get('email')}\nPassword: ${formData.get('password')}`
  );
  return redirect('/register');
}

function Register() {
  const { t } = useTranslation();


  return (
    <Form
      method="post"
      className="w-96 mx-auto bg-white p-5 rounded-xl shadow-sm"
    >
      <label htmlFor="email">
        {t('Email')}:
        <input
          type="text"
          name="email"
          id="email"
          placeholder={t('Email')}
          className="bg-gray-100"
        />
      </label>
      <label htmlFor="login">
        {t('Login')}:
        <input
          type="text"
          name="login"
          id="login"
          placeholder={t('Login')}
          className="bg-gray-100"
        />
      </label>
      <label>
        {t('Password')}:
        <input
          type="password"
          name="password"
          placeholder={t('Password')}
          className="bg-gray-100"
        />
      </label>
      <label>
        {t('Confirm password')}:
        <input
          type="password"
          name="confirm_password"
          placeholder={t('Confirm password')}
          className="bg-gray-100"
        />
      </label>
      <button type="submit" className="bg-gray-100 hover:bg-gray-200">
        {t('Sign Up')}
      </button>
    </Form>
  );
}

export default Register;
