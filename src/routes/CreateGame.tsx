import { useTranslation } from 'react-i18next';
import {
  Form,
  ActionFunctionArgs,
  redirect,
  useActionData,
} from 'react-router-dom';
import { api, query } from '../api';
import { queryClient } from '../main';
import Balancer from 'react-wrap-balancer';
import { CreateGameError, createGameSchema } from '../schemas';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { CreateRoundForm } from '../components/create_round_form/CreateRoundForm';
import { Round } from '../models/Round';

const MAX_ROUNDS = 24;

export async function action({ request }: ActionFunctionArgs) {
  const data = createGameSchema.safeParse(
    Object.fromEntries(await request.formData())
  );

  if (!data.success) {
    return data.error.format();
  }

  try {
    await queryClient.fetchQuery({
      queryFn: () => api.create_game(data.data),
      queryKey: query.getKeyByAlias('me'),
    });
  } catch (rawError) {
    return { _errors: ['Unknown error'] };
  }

  return redirect('/');
}

function CreateGame() {
  const errors = (useActionData() || {}) as FormError<typeof action>;
  const { t } = useTranslation();

  const [addedRounds, setAddedRounds] = useState([] as Round[]);
  const [validationErr, setValidationErr] = useState("");

  const addRound = () => {
    if (addedRounds.length >= MAX_ROUNDS) {
      return;
    }

    setAddedRounds([...addedRounds, {
      name: "",
      description: "",
      datetimeStart: (new Date()).toISOString(),
      datetimeEnd: (new Date()).toISOString()
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
    console.log("new state ", addedRounds[index]);
  }

  const validateRoundsErrMessage = (): string => {
    for (let i = 0; i < addedRounds.length; i++) {
      if (!addedRounds[i].name) {
        return `${t('Err in round')} ${i + 1}: ${t('Name must be non-empty')}`;
      }

      let dateStart = Date.parse(addedRounds[i].datetimeStart);
      let dateEnd = Date.parse(addedRounds[i].datetimeEnd);

      console.log(dateStart, dateEnd);

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

  const handleCreate = () => {
    let roundsErr = validateRoundsErrMessage();

    if (roundsErr) {
      setValidationErr(roundsErr);
      return;
    }
  }


  return (
    <>
      <h1 className="lg:text-5xl self-center lg:w-1/3 font-semibold text-center">
        <Balancer>{t('Create a game')}</Balancer>
      </h1>
      <Form
        method="post"
        className="lg:w-1/2 w-full mx-auto p-5 flex flex-col items-center"
      >
        {'_errors' in errors &&
          errors._errors.map((error) => (
            <p key={error} className="text-red-600">
              {t(error)}
            </p>
          ))}

        <fieldset className="flex flex-col w-full">
          <input
            type="text"
            id="name"
            name="name"
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Name')}
          />
          <input
            type="text"
            id="description"
            name="description"
            className="block w-full bg-white border-gray-100 border-2"
            placeholder={t('Description')}
          />
        </fieldset>

        <div className="flex flex-row w-full mt-2">
          <button
            disabled={addedRounds.length >= MAX_ROUNDS}
            onClick={addRound}
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
                setName={name => handleRoundChange(i, "name", name)}
                setDescription={desc => handleRoundChange(i, "description", desc)}
                setDatetimeStart={date => handleRoundChange(i, "datetimeStart", date)}
                setDatetimeEnd={date => handleRoundChange(i, "datetimeEnd", date)}
              />
            ))
          }
        </div>

        <button
          onClick={handleCreate}
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
