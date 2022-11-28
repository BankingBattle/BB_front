import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

import logoSrc from './logo.jpg';

export function Header() {
  const { t } = useTranslation();

  return (
    <header>
      <NavLink
        className="text-[1.4rem] p-3 lg:px-0 bg-white z-10 whitespace-nowrap flex-grow font-semibold flex items-center text-black"
        to="/"
      >
        <img className="w-12" src={logoSrc} />
        Banking Battle
      </NavLink>
      <a
        tabIndex={0}
        type="button"
        className="burger m-3 lg:hidden text-[1.5rem]"
      >
        ☰
      </a>
      <nav>
        <NavLink
          className={({ isActive }) => (isActive ? 'active' : '')}
          to="/"
        >
          {t('Home')}
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? 'active' : '')}
          to="/login"
        >
          {t('Sign In')}
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? 'active' : '')}
          to="/register"
        >
          {t('Sign Up')}
        </NavLink>
      </nav>
    </header>
  );
}
