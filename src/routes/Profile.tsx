import { useTranslation } from 'react-i18next';
import { NavLink, redirect, useLoaderData } from 'react-router-dom';
import { api, query, user } from '../api';
import { queryClient } from '../main';
import { z } from 'zod';

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
    <>
      <h2>{t('Your profile')}</h2>
      <div className="rounded-2xl shadow-md p-10 flex justify-around">
        <div>
          <h3>{t('Name')}</h3>
          <span>
            {data.first_name} {data.last_name}
          </span>
        </div>
        <div>
          <h3>{t('Email')}</h3>
          <span>{data.email}</span>
        </div>
        <div>
          <h3>{t('Login')}</h3>
          <span>{data.login}</span>
        </div>
        <div>
          <h3>{t('Password')}</h3>
          <span>********</span>
        </div>
      </div>
      <div>
        <h1>{t('Current games')}</h1>
      </div>
      <div>
        <h1>{t('All games')}</h1>
      </div>
    </>
  );
}

export default Profile;
