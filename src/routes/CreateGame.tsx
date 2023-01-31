import { useTranslation } from 'react-i18next';
import {
  Form,
  ActionFunctionArgs,
  redirect,
  useActionData,
} from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import Balancer from 'react-wrap-balancer';

import { isErrorFromAlias } from '@zodios/core';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';
import { CreateGameError, createGameSchema } from '../schemas';
import { A } from '../components/A';

export async function action({ request }: ActionFunctionArgs) {
  const data = createGameSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    await queryClient.fetchQuery({
      queryFn: () => api.create_game(data.data),
      queryKey: query.getKeyByAlias('me'),
    });
  } catch (rawError) {
    return { _errors: ['Unknown error'] };
  }

  return redirect('/');
}

function CreateGame() {
  const errors = (useActionData() || {}) as FormError<typeof action>;
  const { t } = useTranslation();

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">
        <Balancer>{t('Create  a game')}</Balancer>
      </h1>
      <Form
        method="post"
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >
        {'_errors' in errors &&
          errors._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <fieldset className="flex flex-col lg:flex-row w-full">
          <label htmlFor="name" className="w-full m-1">
            {t('Name')}
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t('Game title')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>

          <label htmlFor="description" className="w-full m-1">
            {t('Description')}
            <input
              type="text"
              id="description"
              name="description"
              placeholder={t('Game description')}
              className="block w-full bg-white border-gray-100 border-2"
            />
          </label>
        </fieldset>

        <button
          type="submit"
          className="mx-1 my-1 px-3 py-2 rounded-md transition-colors lg:w-96 w-full my-8 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {t('Create')}
        </button>
      </Form>
    </>
  );
}

export default CreateGame;
