import { useTranslation } from 'react-i18next';
import { ActionFunctionArgs, Form, redirect } from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import Balancer from 'react-wrap-balancer';
import { createGameSchema, createRoundSchema } from '../schemas';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useState } from 'react';
import { CreateRoundForm } from '../components/create_round_form/CreateRoundForm';
import { Round } from '../models/Round';
import { createRoundResponse } from '../api/game';

const MAX_ROUNDS = 24;

export function action({ request } : ActionFunctionArgs) {
  return redirect("/");
}

function CreateGame() {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [addedRounds, setAddedRounds] = useState([] as Round[]);
  const [validationErr, setValidationErr] = useState("");

  const addRound = () => {
    if (addedRounds.length >= MAX_ROUNDS) {
      return;
    }

    setAddedRounds([...addedRounds, {
      game_id: 0,
      name: "",
      description: "",
      datetimeStart: (new Date()).toISOString().slice(0, -1),
      datetimeEnd: (new Date()).toISOString().slice(0, -1)
    }])
  }

  const removeRound = (index: number) => {
    let filteredRounds = [] as Round[];

    for (let i = 0; i < addedRounds.length; i++) {
      if (i != index) {
        filteredRounds.push(addedRounds[i])
      }
    }

    setAddedRounds(filteredRounds);
  }

  const handleRoundChange = (index: number, key: string, value: any) => {
    if (index >= addedRounds.length) {
      return;
    }

    let updatedRounds = [] as Round[];

    for (let i = 0; i < addedRounds.length; i++) {
      if (i != index) {
        updatedRounds.push(addedRounds[i]);
      } else {
        updatedRounds.push({...addedRounds[i], [key]: value});
      }
    }

    setAddedRounds(updatedRounds);
  }

  const validateRoundsErrMessage = (): string => {
    for (let i = 0; i < addedRounds.length; i++) {
      if (!addedRounds[i].name) {
        return `${t('Err in round')} ${i + 1}: ${t('Name must be non-empty')}`;
      }

      let dateStart = Date.parse(addedRounds[i].datetimeStart);
      let dateEnd = Date.parse(addedRounds[i].datetimeEnd);

      if (!dateStart) {
        return `${t('Err in round')} ${i + 1}: ${t('Invalid start datetime')}`;
      }

      if (!dateEnd) {
        return `${t('Err in round')} ${i + 1}: ${t('Invalid end datetime')}`;
      }

      if (dateEnd <= dateStart) {
        return `${t('Err in round')} ${i + 1}: ${t('End date must be greater than start')}`;
      }
    }

    return "";
  }

  const handleCreate = async (event: FormEvent) => {
    if (!name) {
      setValidationErr(t('Name must be non-empty'));
      event.preventDefault();
      return false;
    }

    let roundsErr = validateRoundsErrMessage();

    if (roundsErr) {
      setValidationErr(roundsErr);
      event.preventDefault();
      return false;
    }

    setValidationErr(validateRoundsErrMessage());
    if (validationErr) {
      event.preventDefault();
      return false;
    }

    const gameData = createGameSchema.safeParse(
      Object.create({
        name: name,
        description: description
      })
    );

    if (!gameData.success) {
      setValidationErr("Error");
      event.preventDefault();
      return false;
    }


    try {
      const result = await queryClient.fetchQuery({
        queryFn: () => api.create_game(gameData.data),
        queryKey: query.getKeyByAlias('me'),
      });

      if (!result.response_data) {
        setValidationErr(result.message ?? t("Unknown error"));
        event.preventDefault();
        return;
      }

      const gameId = result.response_data.id;

      for (let i = 0; i < addedRounds.length; i++) {
        await createRound(gameId, addedRounds[i]);
      }

      return true;
    } catch (err) {
      setValidationErr("Unknown error");
      event.preventDefault();
      return false;
    }
  }

  const createRound = async (gameId: number, round: Round) => {
    const roundData = createRoundSchema.safeParse(Object.create({
      ...round,
      game_id: gameId
    }));

    if (!roundData.success) {
      throw new Error("round data parsing failed");
    }

    try {
      const result = await queryClient.fetchQuery({
        queryFn: () => api.create_round(roundData.data),
        queryKey: query.getKeyByAlias('me')
      });

      if (!result.response_data) {
        throw new Error(result.message ?? t("Unknown error"));
      }

    } catch (err) {
      throw err;
    }
  }


  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">
        <Balancer>{t('Create a game')}</Balancer>
      </h1>
      <Form
        method="post"
        onSubmit={handleCreate}
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >

        <fieldset className="flex flex-col w-full">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Name')}
          />
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Description')}
          />
        </fieldset>

        <div className="flex flex-row w-full mt-2">
          <button
            disabled={addedRounds.length >= MAX_ROUNDS}
            onClick={addRound}
            type="button"
            className={addedRounds.length < MAX_ROUNDS
              ? "mx-1 my-1 px-3 py-2 rounded-md transition-colors transition-colors bg-purple-500 hover:bg-purple-600 text-white block"
              : "mx-1 my-1 px-3 py-2 rounded-md transition-colors transition-colors bg-gray-400 text-white block"}>
            <FontAwesomeIcon icon={faCirclePlus} />
            &nbsp;{t('Add round')}
          </button>
          {addedRounds.length > 0 && <span className="mt-2 ml-2 text-gray-600">
            {addedRounds.length} / {MAX_ROUNDS}
          </span>}
        </div>

        <div className="mt-5 overflow-y-scroll max-h-96 border-t-2 border-b-2 border-gray-200">
          {
            addedRounds.map((round, i) => (
              <CreateRoundForm
                key={i}
                index={i}
                remove={removeRound}
                round={round}
                change={(key, value) => handleRoundChange(i, key, value)}
              />
            ))
          }
        </div>

        <button
          type="submit"
          className="mx-1 my-1 px-3 py-2 rounded-md transition-colors lg:w-96 w-full my-8 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {t('Create')}
        </button>

        <div className="text-red-600">
          {validationErr}
        </div>

      </Form>
    </>
  );
}

export default CreateGame;
