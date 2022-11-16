import { Trans, useTranslation } from 'react-i18next';
import { Form, ActionFunctionArgs, redirect } from 'react-router-dom';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  alert(
    `Login: ${formData.get('login')}\nPassword: ${formData.get('password')}`
  );
  return redirect('/');
}

function Login() {
  const { t } = useTranslation();

  return (
    <Form method="post">
      <label>
        <Trans>Login</Trans>:
        <input type="text" name="login" placeholder={t('Login') || ''} />
      </label>
      <label>
        <Trans>Password</Trans>:
        <input
          type="password"
          name="password"
          placeholder={t('Password') || ''}
        />
      </label>
      <button type="submit">{t('Sign In')}</button>
    </Form>
  );
}

export default Login;
