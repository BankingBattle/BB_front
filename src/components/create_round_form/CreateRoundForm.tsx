import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';

interface CreateRoundFormProps {
  key: number
  index: number
  remove: (index: number) => void
  setName: (name: string) => void
  setDescription: (desc: string) => void
  setDatetimeStart: (dtStart: string) => void
  setDatetimeEnd: (dtEnd: string) => void
}

export function CreateRoundForm({ index,
                                  remove,
                                  setName,
                                  setDescription,
                                  setDatetimeStart,
                                  setDatetimeEnd } : CreateRoundFormProps) {
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
          onChange={e => setName(e.target.value)}
          placeholder={`${t('Name')} *`}
          className="block bg-white border-gray-200 border-2 w-1/3"
        />
        &nbsp;
        <input
          name="datetimeStart"
          type="datetime-local"
          value={(new Date()).toISOString()}
          onChange={e => setDatetimeStart(e.target.value)}
          placeholder={t('Start')}
          className="block bg-white border-gray-100 border-2 w-1/3"
        />
        &nbsp;
        <input
          name="datetimeEnd"
          type="datetime-local"
          value={(new Date()).toISOString()}
          onChange={e => setDatetimeEnd(e.target.value)}
          placeholder={t('End')}
          className="block bg-white border-gray-100 border-2 w-1/3"
        />
      </div>
      <div>
        <textarea
          className="block bg-white border-gray-100 border-2 p-2 rounded-md w-full"
          onChange={e => setDescription(e.target.value)}
          cols={70}
          name="description"
          placeholder={t('Description')}
        >
        </textarea>
      </div>
    </div>
  )
}