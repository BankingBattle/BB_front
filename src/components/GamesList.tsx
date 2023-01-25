import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { z } from 'zod';
import { query } from '../api';
import { game } from '../api/game';

type GameRowProps = {
  game: z.infer<typeof game>;
  id: number;
};

export const GameRow: React.FC<GameRowProps> = ({ game, id }) => {
  const { t } = useTranslation();

  const selfTeam = game.leaderboard.find((team) => team.is_current_team);
  const selfPlaceTag =
    (selfTeam &&
      {
        1: '🥇',
        2: '🥈',
        3: '🥉',
      }[selfTeam.place]) ||
    '';

  return (
    <NavLink
      to={`/game/${id}`}
      className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow w-full lg:w-72 h-80 my-4 lg:my-8 p-6 flex flex-col justify-between"
    >
      <div className="h-1/3 w-full bg-gray-100 rounded-xl"></div>
      <h3 className="text-lg font-semibold">{game.name}</h3>
      <p>{game.description}</p>
      <p>
        {selfPlaceTag} {selfTeam?.name}
      </p>
      <div className="flex">
        {selfTeam ? (
          <span className="text-green-500 hover:text-green-600 border flex-1 text-center border-green-500 hover:border-green-600 mx-1 my-1 px-3 py-2 rounded-md transition-colors">
            {t('You are in')}
          </span>
        ) : null}
        <span className="bg-purple-500 hover:bg-purple-600 text-white  mx-1 my-1 px-3 py-2 rounded-md transition-colors">
          {t('Open game')}
        </span>
      </div>
    </NavLink>
  );
};

type GamesListProps = {
  filters?: 'participating'[];
};

export const GamesList: React.FC<GamesListProps> = ({ filters }) => {
  const { t } = useTranslation();
  const { data } = query.useGames();

  const gamesList = useMemo(() => {
    let list = data;

    if (!filters || !list) {
      return list;
    }

    for (const filter of filters) {
      switch (filter) {
        case 'participating':
          list = list.filter((game) =>
            game.leaderboard.find((team) => team.is_current_team)
          );
          break;
      }
    }

    return list;
  }, [data]);

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-3xl font-semibold">{t('Current games')}</h1>
      <div className="flex flex-wrap lg:space-x-8">
        {gamesList?.map((game, index) => (
          <GameRow key={index} id={index + 1} game={game} />
        ))}
      </div>
    </div>
  );
};
