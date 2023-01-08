import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LangChanger } from '../lang_changer';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logoSrc from './logo.svg';

type Props = {
  isLoggedIn: boolean;
};

export function Header({ isLoggedIn }: Props) {
  const { t } = useTranslation();

  const links = useMemo(() => {
    if (isLoggedIn) {
      return [
        {
          children: (
            <>
              <FontAwesomeIcon icon={faUser} /> {t('Profile')}
            </>
          ),
          to: '/me',
          className: 'text-purple-500',
        },
      ];
    }

    return [
      {
        children: t('Log in'),
        to: '/login',
        className: 'lg:border-2 border-gray-700',
      },
      {
        children: t('Sign up'),
        to: '/register',
        className:
          'lg:border-2 border-purple-500 lg:bg-purple-500 lg:text-white',
      },
    ];
  }, [isLoggedIn]);

  return (
    <header className="flex flex-wrap lg:flex items-center justify-center lg:px-64 box-border w-full">
      <div className="p-3 lg:px-0 bg-white z-10 whitespace-nowrap flex flex-grow items-center lg:justify-start justify-center">
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
              `${
                isActive ? 'active' : ''
              } font-semibold h-full block box-border rounded-md ${className}`
            }
          />
        ))}
        <LangChanger />
      </nav>
    </header>
  );
}
