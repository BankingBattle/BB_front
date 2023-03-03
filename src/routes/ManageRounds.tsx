import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionFunctionArgs, redirect, useActionData, useLoaderData, useLocation } from 'react-router-dom';
import { Round } from '../models/Round';
import Balancer from 'react-wrap-balancer';
import { Form } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faClose } from '@fortawesome/free-solid-svg-icons';
import { queryClient } from '../main';
import { api, query } from '../api';
import { z } from 'zod';
import { getGameResponse } from '../api/game';
import { CreateGameError, CreateRoundError, createRoundSchema } from '../schemas';
import { isErrorFromAlias } from '@zodios/core';
import { ZodiosMatchingErrorsByAlias } from '@zodios/core/lib/zodios.types';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });
};

export const action = async ({ request } : ActionFunctionArgs) => {
  const data = createRoundSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    console.log('error data not success: ' + data.error);
    return data.error.format();
  }

  try {
    const result = await queryClient.fetchQuery({
      queryFn: () => api.create_round({ ...data.data }),
      queryKey: query.getKeyByAlias('create_round', {}),
    });

    if (!result.response_data) {
      console.log('error null data');
      return { _errors: ['Unknown error'] };
    }

    console.log('success');
    return redirect(`/manage_rounds/${result.response_data.game_id}`);
  } catch (rawError) {
    console.log('error: ' + rawError);
    if (isErrorFromAlias(api.api, 'create_round', rawError)) {
      const error = rawError as ZodiosMatchingErrorsByAlias<
        typeof api.api,
        'create_round'
      >;

      if (error.response.status === 400) {
        return error.response.data as CreateRoundError;
      }
    }

    return { _errors: ['Unknown error'] };
  }
}

function ManageRounds() {
  const { t } = useTranslation();

  const [round, setRound] = useState({} as Round);

  const { response_data } = useLoaderData() as z.infer<typeof getGameResponse>;
  const errors = (useActionData() || {}) as FormError<typeof action>;
  const gameId = Number(useLocation().pathname.split('/').slice(-1));

  const remove = (index: number) => {

  }

  const change = (key: string, value: any) => {

  }

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-2/5 font-semibold text-center">
        <Balancer>{t('Manage rounds for game')} {response_data.name}</Balancer>
      </h1>
        <div className="flex flex-col rounded-xl w-full p-7 my-2 lg:w-1/2 mx-auto items-center">

          {/* NEW ROUND FORM */}
          <Form method="post">
            {'_errors' in errors &&
              errors._errors.map((error) => (
                <p key={error} className="text-red-600">
                  {t(error)}
                </p>
              ))}
            <div>
              <h3>{t('Add new')}</h3>
            </div>
            <div className="flex flex-row w-full">
              <input
                name="game_id"
                type="hidden"
                value={gameId}
              />
              <input
                name="name"
                value={round.name}
                onChange={e => change("name", e.target.value)}
                placeholder={`${t('Name')} *`}
                className="block bg-white border-gray-200 border-2 w-1/3"
              />
              &nbsp;
              <input
                name="datetime_start"
                value={round.datetimeStart}
                type="datetime-local"
                onChange={e => change("datetimeStart", e.target.value)}
                placeholder={t('Start')}
                className="block bg-white border-gray-100 border-2 w-1/3"
              />
              &nbsp;
              <input
                name="datetime_end"
                value={round.datetimeEnd}
                type="datetime-local"
                onChange={e => change("datetimeEnd", e.target.value)}
                placeholder={t('End')}
                className="block bg-white border-gray-100 border-2 w-1/3"
              />
            </div>
            <div className="w-full">
              <textarea
                className="block bg-white border-gray-100 border-2 p-2 rounded-md w-full"
                onChange={e => change("description", e.target.value)}
                cols={70}
                name="description"
                placeholder={t('Description')}
              >
              </textarea>
            </div>
            <div className="flex flex-row">
              <h3 className="mt-6 mr-3 ml-2">{t('Round data')}</h3>
              <input
                className="mx-1 mt-5 px-3 py-2 rounded-md block text-white cursor-pointer bg-gray-500 w-full"
                id="file_input" type="file"
              />
            </div>
            <div>
              <button
                type="submit"
                className="mx-1 my-1 px-3 py-2 rounded-md transition-colors my-8 bg-purple-500 hover:bg-purple-600 text-white"
              >
                {t('Add')}
              </button>
              <a
                href={`../game/${gameId}`}
                className="mx-1 my-1 px-3 py-2 rounded-md transition-colors my-8 bg-gray-500 hover:bg-gray-600 text-white"
              >
                {t('Go to game')}
              </a>
            </div>
          </Form>

          {/* EXISTING ROUNDS LIST */}
          <div>
            <div>
              <h3>
                {t(response_data.rounds.length > 0
                  ? 'Current rounds'
                  : 'There are no existing rounds')
                }
              </h3>
            </div>
            <div>
              {response_data.rounds.map(round => (<p>{round.name}</p>))}
            </div>
          </div>

        </div>
    </>
  )
}

export default ManageRounds;