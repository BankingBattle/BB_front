import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { Forbidden } from '../components/forbidden';
import { Team } from '../models/Team';
import { EntityCard } from '../components/entity_card';
import {
  faPen,
  faRemove,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameCard } from '../components/game_card';

let team: Team = {
  creator: { username: 'spoon' },
  name: 'Sample team',
  state: 'active',
  users_in_team: [
    { username: 'jfrow0c' },
    { username: 'elbow89r' },
    { username: 'critenz' },
    { username: 'devilator' },
    { username: 'schinla5' },
  ],
  requests: [{ username: 'brrkvbbb' }],
  results: [
    {
      game: { title: 'Game1', description: 'Lorem ipsum' },
      result: '3',
    },
    {
      game: { title: 'Game2', description: 'Lorem ipsum' },
      result: '2',
    },
  ],
};

function TeamProfile() {
  const { t } = useTranslation();

  const [nameEditing, setNameEditing] = useState(false);
  const [nameEditingError, setNameEditingError] = useState(false);
  const [newName, setNewName] = useState(team.name);

  const handleNameChange = (name: string) => {
    if (nameEditingError) return;

    // Logic connected with PUT/PATCH query

    team = { ...team, name: name };
    setNameEditing(false);
  };

  const handleAcceptAll = () => {
    // Not implemented logic
  };

  const handleRejectAll = () => {
    // Not implemented logic
  };

  const handleRequestMembership = () => {
    // Not implemented logic
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
                      setNewName(team.name);
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
                  <h1 className="text-2xl">{team.name}</h1>
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

          <div className="my-4 flex flex-row items-center">
            {team.results.map((result) => (
              <GameCard result={result} />
            ))}
          </div>

          <hr className="my-4" />

          <div className="my-4">
            Team members
            <ul>
              {team.users_in_team.map((player) => (
                <EntityCard entity={player} applyBtn={false} />
              ))}
            </ul>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <FontAwesomeIcon icon={faPlus} /> Request membership
            </button>
          </div>

          <hr className="my-4" />

          <div className="my-4">
            Membership requests
            {team.requests ? (
              <ul>
                {team.requests.map((player, index) => (
                  <EntityCard entity={player} />
                ))}
              </ul>
            ) : (
              <p>No requests</p>
            )}
          </div>

          <div className="my-4 flex flex-row">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={handleRejectAll}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            >
              Reject all
            </button>
          </div>
        </>
      ) : (
        <Forbidden />
      )}
    </div>
  );
}

export default TeamProfile;
