import { useTranslation } from 'react-i18next';
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
  faEdit,
  faSave,
  faXmarkCircle,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';
import { isErrorFromAlias } from '@zodios/core';

import { queryClient } from '../main';
import { api, query } from '../api';
import { user } from '../api/user';
import { GamesList } from '../components/GamesList';
import { ChangeDataError, changeDataSchema } from '../schemas';

export async function loader() {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
      staleTime: 1000,
    })
    .catch(() => redirect('/login'));
}

export async function action({ request }: ActionFunctionArgs) {
  const data = changeDataSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    await queryClient.fetchQuery({
      queryFn: () => api.update(data.data),
      queryKey: query.getKeyByAlias('me'),
    });
  } catch (rawError) {
    if (isErrorFromAlias(api.api, 'update', rawError)) {
      const error = rawError as ZodiosMatchingErrorsByAlias<
        typeof api.api,
        'update'
      >;

      if (error.response.status === 400) {
        return error.response.data as ChangeDataError;
      }
    }

    return { _errors: ['Unknown error'] };
  }

  return null;
}

function Profile() {
  const errors = useActionData() as FormError<typeof action>;
  console.log(errors);
  const { t } = useTranslation();
  const data = useLoaderData() as z.infer<typeof user>;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!errors) {
      setIsEditing(false);
    }
  }, [errors]);

  return (
    <div className="w-full">
      <Form method="post">
        <h2 className="text-3xl font-semibold">
          {t('Your profile')}
          {isEditing ? (
            <button
              type="submit"
              className="text-lg ml-3 box-border text-purple-500 hover:text-purple-600"
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
        <div className="bg-white rounded-3xl my-4 lg:my-8 shadow-lg p-10">
          {errors ? (
            <div className="text-red-500 p-3">
              {t(
                Object.values(errors)
                  .flatMap((error) =>
                    '_errors' in error ? error._errors : error
                  )
                  .find(Boolean)!
              )}
            </div>
          ) : null}
          <div className="flex flex-col lg:flex-row lg:space-x-10 justify-around">
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
              <fieldset
                className={cn({ hidden: !isEditing }, 'flex space-x-2')}
              >
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
              <div className="border border-transparent px-3 py-3">
                {data.login}
              </div>
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
              <fieldset
                className={cn({ hidden: !isEditing }, 'flex space-x-2')}
              >
                <input
                  type="password"
                  name="password"
                  placeholder={t('New password')}
                  className="w-1/2 border border-gray-400"
                />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder={t('Confirm password')}
                  className="w-1/2 border border-gray-400"
                />
              </fieldset>
            </div>
          </div>
        </div>
      </Form>
      <GamesList />
    </div>
  );
}

export default Profile;
