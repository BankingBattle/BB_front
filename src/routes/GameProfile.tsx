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
import { PlayerItem } from '../components/player_item';

let game: Game = {
  title: "Test game",
  description: "Смысл игры заключается в том, чтобы At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga"
}

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
    <div className="lg:w-2/3 mx-auto bg-white p-5 lg:rounded-2xl shadow-sm">
      {true ? (
        <>
          <div className="flex flex-row my-2 justify-between items-center">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {nameEditing ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setNameEditingError(!e.target.value);
                      }}
                      className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-${
                        nameEditingError ? 'red' : 'blue'
                      }-500 focus:border-${
                        nameEditingError ? 'red' : 'blue'
                      }-500 block w-full p-2.5`}
                      placeholder="Team name"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setNameEditing(false);
                      setNewName(game.title);
                    }}
                  >
                    <FontAwesomeIcon icon={faRemove} />
                  </button>
                  <button onClick={() => handleNameChange(newName)}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl">
                    <span className="font-light">Игра</span>
                    &nbsp;
                    <span className="font-bold">{game.title}</span>
                  </h1>
                  <button onClick={() => setNameEditing(true)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </>
              )}
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                backgroundColor: 'gray',
              }}
            ></div>
          </div>

          <hr className="my-4" />
          <p>{game.description}</p>
          <hr className="my-4" />
          <h1 className="text-xl">Команды-участники</h1>
          <div>
            
          </div>
        </>
      ) : (
        <Forbidden />
      )}
    </div>
  );
}

export default GameProfile;