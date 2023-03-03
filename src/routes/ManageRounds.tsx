import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useLocation } from 'react-router-dom';
import { Round } from '../models/Round';
import { CreateRoundForm } from '../components/create_round_form/CreateRoundForm';
import Balancer from 'react-wrap-balancer';
import { Form } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { queryClient } from '../main';
import { api, query } from '../api';
import { z } from 'zod';
import { getGameResponse } from '../api/game';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });
};

export const action = async () => {

}

function ManageRounds() {
  const { t } = useTranslation();
  const [round, setRound] = useState({} as Round);

  const { response_data } = useLoaderData() as z.infer<typeof getGameResponse>;
  const gameId = useLocation().pathname.split('/').slice(-1);

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
            <div>
              <h3>{t('Add new')}</h3>
            </div>
            <div className="flex flex-row w-full">
              <input
                name="name"
                value={round.name}
                onChange={e => change("name", e.target.value)}
                placeholder={`${t('Name')} *`}
                className="block bg-white border-gray-200 border-2 w-1/3"
              />
              &nbsp;
              <input
                name="datetimeStart"
                value={round.datetimeStart}
                type="datetime-local"
                onChange={e => change("datetimeStart", e.target.value)}
                placeholder={t('Start')}
                className="block bg-white border-gray-100 border-2 w-1/3"
              />
              &nbsp;
              <input
                name="datetimeEnd"
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