import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
} from 'react-router-dom';
import { Round } from '../models/Round';
import Balancer from 'react-wrap-balancer';
import { Form } from 'react-router-dom';
import { queryClient } from '../main';
import { api, query } from '../api';
import { Game } from '../api/game';
import { CreateRoundError, createRoundSchema } from '../schemas';
import { isErrorFromAlias } from '@zodios/core';
import { RoundView } from '../components/round_view';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = createRoundSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    const result = await queryClient.fetchQuery({
      queryFn: () => api.createRound({ ...data.data }),
      queryKey: query.getKeyByAlias('createRound', {}),
    });

    if(result.message) {
      return { _errors: [result.message] };
    }

    if (!result) {
      return { _errors: ['Unknown error'] };
    }

    return redirect(`/manage_rounds/${result.game_id}`);
  } catch (error) {
    if (isErrorFromAlias(api.api, 'createRound', error)) {
      if (error.response.status === 400) {
        return error.response.data as CreateRoundError;
      }
    }

    return { _errors: ['Unknown error'] };
  }
};

function ManageRounds() {
  const { t } = useTranslation();

  const [round, setRound] = useState({
    name: '',
    datetimeStart: '',
    datetimeEnd: '',
  } as Round);

  const [file, setFile] = useState({} as File);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const game = useLoaderData() as Game;
  const errors = (useActionData() || {}) as FormError<typeof action>;
  const gameId = Number(useLocation().pathname.split('/').slice(-1));

  const remove = (index: number) => {};

  const uploadData = async (roundId: string, file: File) => {
    if (fileUploaded) {
      return;
    }

    setFileUploading(true);

    try {
      let formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('round_id', roundId);

      const response = await fetch(`/round/uploud_data/${roundId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response);
    } catch (err) {}
  };

  const change = (key: string, value: any) => {
    setRound({ ...round, [key]: value });
  };

  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-2/5 font-semibold text-center">
        <Balancer>
          {t('Manage rounds for game')} {game.name}
        </Balancer>
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
            <h3 className="font-semibold">{t('Add new')}</h3>
          </div>
          <div className="flex flex-row w-full">
            <input name="game_id" type="hidden" value={gameId} />
            <input
              name="name"
              value={round.name}
              onChange={(e) => change('name', e.target.value)}
              placeholder={`${t('Name')} *`}
              className="block bg-white border-gray-200 border-2 w-1/3"
            />
            &nbsp;
            <input
              name="datetime_start"
              value={round.datetimeStart}
              type="datetime-local"
              onChange={(e) => change('datetimeStart', e.target.value)}
              placeholder={t('Start')}
              className="block bg-white border-gray-100 border-2 w-1/3"
            />
            &nbsp;
            <input
              name="datetime_end"
              value={round.datetimeEnd}
              type="datetime-local"
              onChange={(e) => change('datetimeEnd', e.target.value)}
              placeholder={t('End')}
              className="block bg-white border-gray-100 border-2 w-1/3"
            />
          </div>
          <div className="w-full">
            <textarea
              className="block bg-white border-gray-100 border-2 p-2 rounded-md w-full"
              onChange={(e) => change('description', e.target.value)}
              cols={70}
              name="description"
              placeholder={t('Description')}
            ></textarea>
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
        <div className="w-full">
          <div>
            <h3 className="font-semibold">
              {t(
                game.rounds?.length
                  ? 'Current rounds'
                  : 'There are no existing rounds'
              )}
            </h3>
          </div>
          <div>
            {game.rounds?.map((round) => (
              <RoundView
                key={round.id?.toString()}
                id={round.id ?? -1}
                name={round.name ?? ""}
                description={round.description ?? 'No description'}
                datetimeStart={round.datetime_start}
                datetimeEnd={round.datetime_end}
                editable={false}
                deleteCallback={() => remove(round.id ?? -1)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageRounds;
