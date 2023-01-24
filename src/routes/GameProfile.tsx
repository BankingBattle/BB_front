import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { Forbidden } from '../components/forbidden';
import {
  faPen,
  faRemove,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Game } from '../models/Game';
import { EntityCard } from '../components/entity_card';

let game: Game = {
  title: "Trial Game",
  description: "Смысл игры заключается в том, чтобы At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga"
}

let teams = [
  {
    creator: { username: 'spoon' },
    name: 'Blue team',
    state: 'active',
    users_in_team: [],
    requests: [{ username: 'brrkvbbb' }],
    results: [],
  },
  {
    creator: { username: 'andrew' },
    name: 'Red team',
    state: 'active',
    users_in_team: [],
    requests: [{ username: 'brrkvbbb' }],
    results: [],
  }
]

function GameProfile() {
  const { t } = useTranslation();

  const [nameEditing, setNameEditing] = useState(false);
  const [nameEditingError, setNameEditingError] = useState(false);
  const [newName, setNewName] = useState(game.title);

  const handleNameChange = (name: string) => {
    if (nameEditingError) return;
    game = { ...game, title: name };
    setNameEditing(false);
  };

  return (
    <div className="lg:w-5/6 mx-auto bg-white p-5 lg:rounded-xl shadow-sm">
      {t.length == 2 ? (
        <>
          <h1 className="flex justify-center text-2xl">{game.title}</h1>
          <div className="flex flex-col w-full mt-5">
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/3">

                <div className="p-5 m-2 lg:rounded-xl shadow-sm bg-gray-100">
                  <h1 className="flex justify-center text-xl antialiased uppercase">Ваш результат</h1>
                  <a href="team" className="flex justify-center text-sm">{teams[0].name}</a>
                  <br/>
                  <p className="flex justify-center text-sm text-slate-500">
                    Баллы
                  </p>
                  <h1 className="flex justify-center text-5xl">0</h1>
                  <h2></h2>
                </div>

                <div className="p-5 m-2 lg:rounded-xl shadow-sm bg-gray-100">
                  <h1 className="flex justify-center text-xl antialiased uppercase">Лидеры</h1>
                  <p className="flex justify-center text-sm text-slate-500">
                    Лидерборд участников соревнования
                  </p>
                </div>

              </div>

              <div className="p-5 m-2 lg:rounded-xl shadow-sm bg-gray-100 w-2/3">
                <h1 className="flex justify-center text-xl antialiased uppercase">Описание</h1>
                <br/>
                <p className="text-slate-500">{game.description}</p>
              </div>

            </div>
            <div className="flex flex-row justify-between w-full bg-gray-100 shadow-sm lg:rounded-xl p-5 m-2">
              <p>ID раунда</p>
              <p>Название раунда</p>
              <p>Открыть раунд</p>
            </div>
          </div>
        </>
      ) : (
        <Forbidden />
      )}
    </div>
  );
}

export default GameProfile;