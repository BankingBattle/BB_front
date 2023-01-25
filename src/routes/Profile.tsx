import { useTranslation } from 'react-i18next';
import { redirect, useLoaderData } from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import { z } from 'zod';
import { user } from '../api/user';
import { GamesList } from '../components/GamesList';

export async function loader() {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
      staleTime: 1000,
    })
    .catch(() => redirect('/login'));
}

function Profile() {
  const { t } = useTranslation();
  const data = useLoaderData() as z.infer<typeof user>;

  return (
    <div>
      <h2 className="text-3xl font-semibold">{t('Your profile')}</h2>
      <div className="bg-white rounded-2xl my-4 lg:my-8 shadow-lg p-10 flex space-x-10 justify-around">
        <div className="flex-1">
          <h3 className="font-semibold">{t('Name')}</h3>
          <span>
            {data.first_name} {data.last_name}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{t('Email')}</h3>
          <span>{data.email}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{t('Login')}</h3>
          <span>{data.login}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{t('Password')}</h3>
          <span>********</span>
        </div>
      </div>
      <GamesList />
    </div>
  );
}

export default Profile;
