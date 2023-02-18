import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { Round } from '../../models/Round';

interface CreateRoundFormProps {
  key: number
  index: number
  remove: (index: number) => void
  round: Round
  change: (key: string, value: string) => void
}

export function CreateRoundForm({ index, remove, round, change } : CreateRoundFormProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col rounded-xl w-full p-2 my-2">
      <div className="flex flex-row justify-between">
        <h2>{t('Round')} {index + 1}</h2>
        <button onClick={() => remove(index)}>
          <FontAwesomeIcon
            icon={faClose}
            color="gray"
          />
        </button>
      </div>
      <div className="flex flex-row w-full">
        <input
          name="name"
          value={round.name}
          onChange={e => change("name", e.target.value)}
          placeholder={`${t('Name')} *`}
          className="block bg-white border-gray-200 border-2 w-1/3"
        />
        &nbsp;
        <input
          name="datetimeStart"
          value={round.datetimeStart}
          type="datetime-local"
          onChange={e => change("datetimeStart", e.target.value)}
          placeholder={t('Start')}
          className="block bg-white border-gray-100 border-2 w-1/3"
        />
        &nbsp;
        <input
          name="datetimeEnd"
          value={round.datetimeEnd}
          type="datetime-local"
          onChange={e => change("datetimeEnd", e.target.value)}
          placeholder={t('End')}
          className="block bg-white border-gray-100 border-2 w-1/3"
        />
      </div>
      <div>
        <textarea
          className="block bg-white border-gray-100 border-2 p-2 rounded-md w-full"
          onChange={e => change("description", e.target.value)}
          cols={70}
          name="description"
          placeholder={t('Description')}
        >
        </textarea>
      </div>
    </div>
  )
}