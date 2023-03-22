import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { query } from '../api';
import type { Game } from '../api/game';

type GameRowProps = {
  game: Game;
};

export const GameRow: React.FC<GameRowProps> = ({ game }) => {
  const { t } = useTranslation();

  const selfTeam = game.leaderboard?.find((team) => team.is_current_team);
  const selfPlaceTag =
    (selfTeam &&
      {
        1: '🥇',
        2: '🥈',
        3: '🥉',
      }[selfTeam.place]) ||
    '';

  return (
    <NavLink to={`/game/${game.id}`} className="w-full lg:w-72">
      <motion.div
        layoutId={`game-${game.id}`}
        key={`game-${game.id}`}
        className="bg-white lg:rounded-3xl shadow-lg hover:shadow-xl h-80 transition-shadow p-6 flex flex-col justify-between"
      >
        <motion.div
          layoutId={`game-image-${game.id}`}
          className="h-1/3 w-full bg-gray-100 rounded-xl"
        ></motion.div>
        <h3 className="text-lg font-semibold">{game.name}</h3>
        <p>{game.description}</p>
        <p>
          {selfPlaceTag} {selfTeam?.name}
        </p>
        <div className="flex">
          {selfTeam ? (
            <>
              <span className="text-green-500 hover:text-green-600 border flex-1 text-center border-green-500 hover:border-green-600 mx-1 my-1 px-3 py-2 rounded-md transition-colors">
                {t('You are in')}
              </span>
              <span className="bg-purple-500 hover:bg-purple-600 text-white mx-1 my-1 px-3 py-2 rounded-md transition-colors">
                {t('Open game')}
              </span>
            </>
          ) : (
            <span className="bg-purple-500 text-center hover:bg-purple-600 text-white flex-1 mx-1 my-1 px-3 py-2 rounded-md transition-colors">
              {t('Sign up')}
            </span>
          )}
        </div>
      </motion.div>
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
            game.leaderboard?.find((team) => team.is_current_team)
          );
          break;
      }
    }

    return list;
  }, [data]);

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-3xl font-semibold lg:mb-8 mb-4">
        {t('Current games')}
      </h1>
      <div className="flex flex-wrap lg:gap-x-8 lg:gap-y-8 gap-y-4">
        {gamesList?.map((game, index) => (
          <GameRow key={index} game={game} />
        ))}
      </div>
    </div>
  );
};
