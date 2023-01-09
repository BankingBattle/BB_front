import { Outlet, useLoaderData } from 'react-router-dom';
import { Header } from '../components/header';
import { api, query } from '../api';
import { queryClient } from '../main';

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

  return (
    <>
      <Header isLoggedIn={Boolean(data)} />
      <main className="py-10 container mx-auto flex flex-col items-center">
        <Outlet />
      </main>
    </>
  );
}

export default App;
