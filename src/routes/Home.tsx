import { GamesList } from '../components/GamesList';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { queryClient } from '../main';
import { api, query } from '../api';
import { useLoaderData } from 'react-router-dom';
import { A } from '../components/A';

export const loader = async () => {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
      staleTime: 1000,
    })
    .catch(() => null);
};

function Home() {
  const { t } = useTranslation();
  const data = useLoaderData();

  return (
    <>
      {Boolean(data) && (
        <A
          className="mx-1 my-5 px-3 py-2 rounded-md transition-colors bg-purple-500 text-white block"
          to="/create"
        >
          <FontAwesomeIcon icon={faCirclePlus} />
          &nbsp;{t('Create a game')}
        </A>
      )}
      <GamesList />
    </>
  );
}

export default Home;
