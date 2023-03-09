import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { z } from 'zod';
import { api, query } from '../api';
import { game, getGameResponse } from '../api/game';
import { A } from '../components/A';
import { queryClient } from '../main';
import { RoundView } from '../components/round_view';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });
};

function Game() {
  const { t } = useTranslation();

  const { response_data } = useLoaderData() as z.infer<typeof getGameResponse>;

  const team = response_data?.leaderboard.find((team) => team.is_current_team);

  console.log(response_data);

  return (
    <div className="lg:w-5/6 mx-auto bg-white p-10 lg:rounded-3xl shadow-2xl">
      <h1 className="flex justify-center text-3xl">{response_data?.name}</h1>
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
              <ol className="text-center">
                {response_data?.leaderboard.map((team, i) => {
                  const placement =
                    {
                      1: '🥇',
                      2: '🥈',
                      3: '🥉',
                    }[team.place] || `${team.place}. `;
                  return (
                    <li>
                      <span className="text-slate-500">{placement}</span>{' '}
                      {team.name}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="p-5 lg:ml-4 mt-4 lg:mt-0 lg:rounded-xl shadow-sm bg-gray-100 w-full">
            <h1 className="flex justify-center text-xl antialiased uppercase mb-5">
              {t('Description')}
            </h1>
            <p className="text-slate-500">{response_data?.description}</p>
          </div>
        </div>
        <div className="text-2xl p-2 m-2">{t('Rounds')}</div>
        {response_data?.rounds.map(round => (
          <RoundView
            name={round.name}
            description={round.description ?? ""}
            datetimeStart={round.datetime_start}
            datetimeEnd={round.datetime_end}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;
