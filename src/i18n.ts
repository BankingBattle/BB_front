import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      Home: 'Главная страница',
      Profile: 'Личный кабинет',
      Login: 'Логин',
      Password: 'Пароль',
      'New password': 'Новый пароль',
      'Log in': 'Войти',
      'Log out': 'Выход',
      'Sign up': 'Зарегистрироваться',
      'Confirm password': 'Подтвердите пароль',
      'Register for Banking Battle': 'Регистрация в Битве Банков',
      'Log in to Banking Battle': 'Вход в Битву Банков',
      'First name': 'Имя',
      'Last name': 'Фамилия',
      Name: 'Имя',
      Email: 'Почта',
      'Already have an account? ': 'Уже есть аккаунт? ',
      "Don't have an account? ": 'Нет аккаунта? ',
      'Forgot password?': 'Забыли пароль?',
      'Enter login': 'Введите логин',
      'Enter nickname': 'Придумайте логин',
      'Enter your e-mail': 'Введите адрес вашей электронной почты',
      'Your first name': 'Ваше имя',
      'Your last name': 'Ваша фамилия',
      'Unknown error': 'Неизвестная ошибка',
      'Passwords must match': 'Пароли должны совпадать',
      'No active account found with the given credentials':
        'Неправильный логин или пароль',
      'Invalid email': 'Неверный E-Mail',
      'Password must be 8 or more characters':
        'Пароль не может быть короче 8 символов',
      'Login must be 3 or more characters':
        'Логин не может быть короче 3 символов',
      'Email already exists': 'Пользователь с таким E-Mail уже существует',
      'Login already exists': 'Пользователь с таким логином уже существует',
      Game: 'Игра',
      Description: 'Описание',
      'Your team': 'Ваша команда',
      'Current games': 'Текущие игры',
      'Open game': 'К игре',
      'You are in': 'Вы участвуете',
      Leaderboards: 'Лидерборд',
      Team: 'Команда',
      Result: 'Результат',
      'All games': 'Все игры',
      'Your profile': 'Профиль',
      'Round ID': 'ID раунда',
      'Round name': 'Название раунда',
      'Open round': 'Ссылка на раунд',
      'Your result': 'Ваш результат',
      Score: 'Очки',
      Leaders: 'Лидеры',
      'Leaderboard of participants': 'Лидерборд участников',
      Rounds: 'Раунды',
      Round: 'Раунд',
      'Add round': 'Добавить раунд',
      'Name must be non-empty': 'Имя не должно быть пустым',
      'Err in round': 'Ошибка в раунде',
      'End date must be greater than start':
        'Дата окончания должна быть больше даты начала',
      'Create a game': 'Создать игру',
      Create: 'Создать',
      Start: 'Начало',
      End: 'Конец',
      'Upload data': 'Загрузить данные',
      'Manage rounds for game': 'Управление раундами игры',
      'Add new': 'Добавить новый',
      Add: 'Добавить',
      'Go to game': 'Перейти к игре',
      'There are no existing rounds': 'Раундов пока нет',
      'Round data': 'Данные раунда',
      'Current rounds': 'Добавленные раунды',
      'Start time': 'Начало',
      'End time': 'Окончание',
      Dates: 'Даты',
      Features: 'Features',
      Tests: 'Tests',
      'Upload solution': 'Upload solution',
      Send: 'Send',
      'Your team submits': 'Your team submits',
      Date: 'Date',
      Filename: 'Filename',
      'Delete game': 'Удалить игру',
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
