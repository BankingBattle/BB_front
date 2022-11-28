import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import logoSrc from './logo.svg';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white flex flex-wrap lg:flex items-center justify-center shadow-sm lg:px-64 box-border w-full">
      <div className="p-3 lg:px-0 bg-white z-10 whitespace-nowrap flex flex-grow items-center lg:justify-start justify-center">
        <NavLink className="text-2xl text-black font-bold inline-flex" to="/">
          <img className="w-10" src={logoSrc} />
          Banking
          <span className="text-[#F98A2F]">Battle</span>
        </NavLink>
      </div>
      <a
        tabIndex={0}
        type="button"
        className="burger peer lg:hidden text-[1.5rem] absolute top-0 right-0 pt-2 pb-3 px-3 z-20"
      >
        ☰
      </a>
      <nav className="peer-focus-within:mt-0 overflow-hidden -mt-[100%] lg:h-full lg:mt-0 flex flex-col lg:flex-row items-center transition-all bg-transparent lg:w-auto w-full">
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
