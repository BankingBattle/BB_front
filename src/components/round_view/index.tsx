import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";

interface RoundViewProps {
  name: string
  description: string
  datetimeStart: string
  datetimeEnd: string
  editable?: boolean
  deleteCallback?: () => void
  applyCallback?: (name: string, desc: string) => void
}


export function RoundView({ name,
                            description,
                            datetimeStart,
                            datetimeEnd,
                            editable = true,
                            deleteCallback = () => {},
                            applyCallback = (name, desc) => {}} : RoundViewProps) {

  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);


  return (
    <div className="flex flex-row justify-between p-2 m-2 lg:rounded-2xl bg-gray-200">

      {isEdit
        ? <div className="flex flex-col">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
        </div>
        : <div className="flex flex-col mt-2">
          <div>
            {name}
          </div>
          <div className="text-gray-500">
            {description}
          </div>
      </div>}

      <div className="mt-2">
        {new Date(datetimeStart).toLocaleString()} - {new Date(datetimeEnd).toLocaleString()}
      </div>

      {isEdit
        ? <button
          onClick={() => applyCallback(newName, newDescription)}
          className="p-3 ml-3 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faCheck} />
          </button>
        : <div className="flex flex-row">
          { editable && <button
            onClick={() => setIsEdit(true)}
            className="p-3 ml-3 border border-black hover:bg-black hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faPencil} />
          </button> }
          <button
            onClick={deleteCallback}
            className="p-3 ml-3 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      }

    </div>
  )
}