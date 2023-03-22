import { useTranslation } from 'react-i18next';
import { ActionFunctionArgs, Form, redirect } from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import Balancer from 'react-wrap-balancer';
import { useActionData } from 'react-router-dom';
import { CreateGameError, createGameSchema } from '../schemas';
import { useState } from 'react';
import { isErrorFromAlias } from '@zodios/core';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';

export async function action({ request }: ActionFunctionArgs) {
  const data = createGameSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    const result = await queryClient.fetchQuery({
      queryFn: () => api.create_game({ ...data.data }),
      queryKey: query.getKeyByAlias('create_game', {}),
    });

    if (!result) {
      return { _errors: ['Unknown error'] };
    }

    return redirect(`/manage_rounds/${result.id}`);
  } catch (rawError) {
    if (isErrorFromAlias(api.api, 'create_game', rawError)) {
      const error = rawError as ZodiosMatchingErrorsByAlias<
        typeof api.api,
        'create_game'
      >;

      if (error.response.status === 400) {
        return error.response.data as CreateGameError;
      }
    }

    return { _errors: ['Unknown error'] };
  }
}

function CreateGame() {
  const { t } = useTranslation();
  const errors = (useActionData() || {}) as FormError<typeof action>;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">
        <Balancer>{t('Create a game')}</Balancer>
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

        <fieldset className="flex flex-col w-full">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Name')}
          />
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Description')}
          />
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
