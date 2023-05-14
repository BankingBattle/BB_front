import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, query } from '../api';
import { A } from '../components/A';
import { queryClient } from '../main';
import { RoundView } from '../components/round_view';
import type { Game } from '../api/game';
import { useEffect, useState } from 'react';

export const loader = async ({ params }: { params: { id: string } }) => {
  const data = await queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });

  if (!data) {
    throw new Response('', { status: 404 });
  }

  return data;
};

function Game() {
  const { t } = useTranslation();
  const { id } = useParams();

  const game = useLoaderData() as Game;

  const team = game.leaderboard?.find((team) => team.is_current_team);
  const [ isAdmin, setIsAdmin ] = useState(false);

  useEffect(() => {
    console.log(game.participating);
    fetch('/api/1.0.0/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsAdmin(data.response_data.is_admin);
        } else {
          console.log('error get me: ' + data.message);
        }
      })
  }, []);

  const enterGame = async () => {
    console.log('here');
    try {
      const response = await fetch(`/api/1.0.0/team/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (response.status !== 200) {
        console.log('Fail');
        return;
      }

      const data = await response.json();


      if (data.status_code === 404) {
        // TODO handle
        window.location.href = "/";
      } else {
        // TODO handle
      }

    } catch (e) {
      console.error(e);
    }
  }

  const deleteGame = async () => {
    try {
      const response = await fetch(`/api/1.0.0/game/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({is_active: "false"}),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        window.location.href = "/";
      }

      console.log(response);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <motion.div
      key={`game-${id}`}
      layoutId={`game-${id}`}
      className="lg:w-5/6 w-full bg-white p-10 lg:rounded-3xl shadow-2xl"
    >
      <h1 className="flex justify-center text-3xl">{game.name}</h1>
      <div className="flex flex-col w-full mt-5">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:w-1/3">
            {team ? (
              <div className="p-5 mb-4 lg:rounded-xl shadow-sm bg-gray-100">
                <h1 className="flex justify-center text-xl antialiased uppercase">
                  {t('Your result')}
                </h1>
                <A
                  to={`/team/${team.id}`}
                  className="flex justify-center text-sm mb-5"
                >
                  {team.name}
                </A>
                <p className="flex justify-center text-sm text-slate-500">
                  {t('Score')}
                </p>
                <h1 className="flex justify-center text-5xl">{team.points}</h1>
              </div>
            ) : null}

            <div className="p-5 lg:rounded-xl shadow-sm bg-gray-100">
              <h1 className="flex justify-center text-xl antialiased uppercase">
                {t('Leaders')}
              </h1>
              <p className="flex justify-center text-sm text-slate-500 mb-5">
                {t('Leaderboard of participants')}
              </p>
              {game.leaderboard ? (
                <ol className="text-center">
                  {game.leaderboard.map((team) => {
                    const placement =
                      {
                        1: '🥇',
                        2: '🥈',
                        3: '🥉',
                      }[team.place] || `${team.place}. `;
                    return (
                      <li key={team.id}>
                        <span className="text-slate-500">{placement}</span>{' '}
                        {team.name}
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </div>
          </div>

          <motion.div
            layoutId={`game-image-${id}`}
            className="p-5 lg:ml-4 mt-4 lg:mt-0 lg:rounded-xl shadow-sm bg-gray-100 w-full"
          >
            <h1 className="flex justify-center text-xl antialiased uppercase mb-5">
              {t('Description')}
            </h1>
            <p className="text-slate-500">{game.description}</p>
          </motion.div>
        </div>
        <div className="text-2xl p-2 m-2">{t('Rounds')}</div>
        {game.rounds
          ? game.rounds.map((round) => (
              <RoundView
                key={round.id?.toString()}
                name={round.name ?? ''}
                description={round.description ?? ''}
                datetimeStart={round.datetime_start}
                datetimeEnd={round.datetime_end}
                id={round.id ?? -1}
              />
            ))
          : null}
        {!game.rounds?.length &&
          <div className="ml-4 mb-4 text-gray-500">
            {t('No rounds')}
          </div>}
      </div>
      <div>
        <hr />
        {isAdmin && <button
          onClick={deleteGame}
          className="mx-1 mt-4 px-3 py-2 rounded-md transition-colors bg-red-500 hover:bg-red-600 text-white">
          {t('Delete game')}
        </button>}
        {!game.participating && <button
          onClick={enterGame}
          className="mx-1 mt-4 px-3 py-2 rounded-md transition-colors bg-blue-500 hover:bg-blue-600 text-white">
          {t('Participate')}
        </button>}
      </div>
    </motion.div>
  );
}

export default Game;
