import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      Home: 'Главная страница',
      Login: 'Логин',
      Password: 'Пароль',
      'Log in': 'Войти',
      'Sign up': 'Зарегистрироваться',
      'Confirm password': 'Подтвердите пароль',
      'Register for Banking Battle': 'Регистрация в Битве Банков',
      'Log in to Banking Battle': 'Вход в Битву Банков',
      'First name': 'Имя',
      'Last name': 'Фамилия',
      'Email': 'Почта',
      'Already have an account? ': 'Уже есть аккаунт? ',
      'Don\'t have an account? ': 'Нет аккаунта? ',
      'Forgot password?': 'Забыли пароль?',
      'Enter login': 'Введите логин',
      'Enter nickname': 'Придумайте логин',
      'Enter your e-mail': 'Введите адрес вашей электронной почты',
      'Your first name': 'Ваше имя',
      'Your last name': 'Ваша фамилия',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
