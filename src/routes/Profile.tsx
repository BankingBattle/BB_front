import { useTranslation } from 'react-i18next';
import { Form, redirect, useLoaderData } from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import { z } from 'zod';
import { user } from '../api/user';
import { GamesList } from '../components/GamesList';
import { useState } from 'react';
import {
  faEdit,
  faSave,
  faXmarkCircle,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

export async function loader() {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
      staleTime: 1000,
    })
    .catch(() => redirect('/login'));
}

export async function action() {
  return null;
}

function Profile() {
  const { t } = useTranslation();
  const data = useLoaderData() as z.infer<typeof user>;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full">
      <Form method="post">
        <h2 className="text-3xl font-semibold">
          {t('Your profile')}
          {isEditing ? (
            <button
              type="submit"
              className="text-lg ml-3 box-border text-purple-500 hover:text-purple-600"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          ) : null}
          <button
            type="button"
            className="text-lg ml-3 box-border text-purple-500 hover:text-purple-600"
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
              } else {
                setIsEditing(false);
              }
            }}
          >
            <FontAwesomeIcon icon={isEditing ? faXmarkCircle : faEdit} />
          </button>
        </h2>
        <div className="bg-white rounded-3xl my-4 lg:my-8 shadow-lg p-10 flex flex-col lg:flex-row lg:space-x-10 justify-around">
          <div className="flex-1">
            <h3 className="font-semibold px-3">{t('Name')}</h3>
            <div
              className={cn(
                { hidden: isEditing },
                'border border-transparent px-3 py-3'
              )}
            >
              {data.first_name} {data.last_name}
            </div>
            <fieldset className={cn({ hidden: !isEditing }, 'flex space-x-2')}>
              <input
                name="first_name"
                defaultValue={data.first_name}
                className="w-1/2 border border-gray-400"
              />
              <input
                name="last_name"
                defaultValue={data.last_name}
                className="w-1/2 border border-gray-400"
              />
            </fieldset>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold px-3">{t('Email')}</h3>
            <div
              className={cn(
                { hidden: isEditing },
                'border border-transparent px-3 py-3'
              )}
            >
              {data.email}
            </div>
            <input
              name="email"
              defaultValue={data.email}
              className={cn(
                { hidden: !isEditing },
                'w-full border border-gray-400'
              )}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold px-3">{t('Login')}</h3>
            <div
              className={cn(
                { hidden: isEditing },
                'border border-transparent px-3 py-3'
              )}
            >
              {data.login}
            </div>
            <input
              name="login"
              className={cn(
                { hidden: !isEditing },
                'w-full border border-gray-400'
              )}
              defaultValue={data.login}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold px-3">{t('Password')}</h3>
            <div
              className={cn(
                { hidden: isEditing },
                'border border-transparent px-3 py-3'
              )}
            >
              ********
            </div>
            <fieldset className={cn({ hidden: !isEditing }, 'flex space-x-2')}>
              <input
                type="password"
                name="password"
                placeholder={t('New password')}
                className="w-1/2 border border-gray-400"
              />
              <input
                type="repeat_password"
                name="repeat_password"
                placeholder={t('Confirm password')}
                className="w-1/2 border border-gray-400"
              />
            </fieldset>
          </div>
        </div>
      </Form>
      <GamesList />
    </div>
  );
}

export default Profile;
