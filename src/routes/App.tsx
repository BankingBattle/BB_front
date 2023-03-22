import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
import { Header } from '../components/header';
import { api, query } from '../api';
import { queryClient } from '../main';
import { useTranslation } from 'react-i18next';
import { I18nProvider } from 'react-aria';

export const loader = async () => {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
      staleTime: 1000,
    })
    .catch(() => null);
};

function App() {
  const data = useLoaderData();
  const location = useLocation();
  const { i18n } = useTranslation();

  return (
    <I18nProvider locale={i18n.language}>
      <Header isLoggedIn={Boolean(data)} />
      <main
        key={location.pathname}
        className="py-10 container mx-auto flex flex-col items-center"
      >
        <Outlet />
      </main>
    </I18nProvider>
  );
}

export default App;
