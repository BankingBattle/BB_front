import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LangChanger } from '../lang_changer';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logoSrc from './logo.svg';
import { queryClient } from '../../main';
import cn from 'classnames';

type Props = {
  isLoggedIn: boolean;
};

export function Header({ isLoggedIn }: Props) {
  const { t } = useTranslation();

  const links = useMemo(() => {
    if (isLoggedIn) {
      return [
        {
          key: 'me',
          children: (
            <>
              <FontAwesomeIcon icon={faUser} />
              &nbsp;&nbsp;{t('Profile')}
            </>
          ),
          to: '/profile',
          className: 'py-2 lg:mr-20 hover:text-purple-500',
        },
        {
          key: 'logout',
          children: t('Log out'),
          onClick: () => {
            queryClient.clear();
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
          },
          to: '/',
          className: 'py-2 lg:mr-20 hover:text-purple-500 text-black',
        },
      ];
    }

    return [
      {
        key: 'login',
        children: t('Log in'),
        to: '/login',
        className: cn(
          'lg:mx-5 lg:px-5 lg:py-2 lg:rounded-md',
          'lg:border-2 lg:border-gray-600 lg:hover:border-gray-800',
          'lg:text-gray-600 lg:hover:text-gray-800'
        ),
      },
      {
        key: 'register',
        children: t('Sign up'),
        to: '/register',
        className: cn(
          'lg:mx-5 lg:px-5 lg:py-2 lg:rounded-md',
          'lg:bg-purple-500 lg:hover:bg-purple-600',
          'lg:border-2 lg:border-purple-500 lg:hover:border-purple-500 ',
          'lg:text-white lg:hover:text-white'
        ),
      },
    ];
  }, [isLoggedIn, t]);

  return (
    <header className="flex flex-wrap lg:flex items-center justify-center lg:px-64 box-border w-full">
      <div className="p-3 lg:px-0 z-10 whitespace-nowrap flex flex-grow items-center lg:justify-start justify-center">
        <NavLink className="text-2xl text-black font-bold inline-flex" to="/">
          <img className="w-10" src={logoSrc} />
          Banking
          <span className="text-purple-500">Battle</span>
        </NavLink>
      </div>
      <a
        tabIndex={0}
        type="button"
        className="burger peer text-black lg:hidden text-[1.5rem] absolute top-0 right-0 pt-2 pb-3 px-3 z-20"
      >
        ☰
      </a>
      <nav className="peer-focus-within:mt-0 overflow-hidden -mt-[100%] lg:h-full lg:mt-0 flex flex-col lg:flex-row items-center transition-all bg-transparent lg:w-auto w-full">
        {links.map(({ className, ...link }) => (
          <NavLink
            {...link}
            className={({ isActive }) =>
              cn(
                'font-semibold transition-colors',
                {
                  'text-purple-500 rounded-md': isActive,
                },
                className
              )
            }
          />
        ))}
        <LangChanger />
      </nav>
    </header>
  );
}
