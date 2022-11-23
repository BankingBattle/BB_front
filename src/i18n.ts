import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      Home: 'Главная страница',
      Login: 'Логин',
      Password: 'Пароль',
      'Sign In': 'Войти',
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
