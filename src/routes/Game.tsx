import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { z } from 'zod';
import { api, query } from '../api';
import { game } from '../api/game';
import { queryClient } from '../main';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.game({ params }),
    queryKey: query.getKeyByAlias('game', { params }),
    staleTime: 1000,
  });
};

function Game() {
  const { t } = useTranslation();

  const data = useLoaderData() as z.infer<typeof game>;
  return (
    <div className="w-full bg-white shadow-2xl rounded-3xl p-10">
      <div className="bg-black bg-opacity-50 rounded-3xl text-white w-full h-64 p-10">
        <h1 className="text-3xl">{data.name}</h1>
        <p className="my-5">{data.description}</p>
      </div>
      <div className="flex justify-between p-10">
        <div>
          <h2 className="text-3xl flex-1 mb-5">{t('Description')}</h2>
          {data.description}
        </div>
        <div>
          <h2 className="text-3xl mb-5">{t('Leaderboards')}</h2>
          <table>
            <tr>
              <th colSpan={2}>{t('Team')}</th>
              <th>{t('Result')}</th>
            </tr>
            {data.leaderboard.map((team) => {
              const placement =
                {
                  1: '🥇',
                  2: '🥈',
                  3: '🥉',
                }[team.place] || `${team.place}. `;
              return (
                <tr
                  key={team.id}
                  className={team.is_current_team ? 'text-semibold' : ''}
                >
                  <td>{placement}</td>
                  <td className="pl-2 pr-5">{team.name}</td>
                  <td>{team.points}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Game;
