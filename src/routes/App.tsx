import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  const { t } = useTranslation();

  return (
    <>
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
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
