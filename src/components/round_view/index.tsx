import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";

interface RoundViewProps {
  name: string
  description: string
  datetimeStart: string
  datetimeEnd: string
}

export function RoundView({ name, description, datetimeStart, datetimeEnd } : RoundViewProps) {
  const [isEdit, setIsEdit] = useState(false);

  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);


  const handleApply = () => {
    if (newName.length === 0) {
      return;
    }
    setIsEdit(false);
  }

  const handleDelete = () => {
    // TODO
  }

  return (
    <div className="flex flex-row justify-between p-2 m-2 lg:rounded-2xl bg-gray-50">

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
        : <div className="flex flex-col">
          <div>
            {name}
          </div>
          <div className="text-gray-500">
            {description}
          </div>
      </div>}

      <div>
        {datetimeStart} - {datetimeEnd}
      </div>

      {isEdit
        ? <button
          onClick={handleApply}
          className="p-3 ml-3 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faCheck} />
          </button>
        : <div className="flex flex-row">
          <button
            onClick={() => setIsEdit(true)}
            className="p-3 ml-3 border border-black hover:bg-black hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            onClick={handleDelete}
            className="p-3 ml-3 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      }

    </div>
  )
}