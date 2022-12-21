import { Player } from '../../models/Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faCheck } from '@fortawesome/free-solid-svg-icons';

interface PlayerItemProps {
  player: Player
  cancelBtn?: boolean
  applyBtn?: boolean
  cancelAction?: () => void
  applyAction?: () => void
}

export function PlayerItem({ player,
                             cancelBtn = true,
                             applyBtn = true,
                             cancelAction = () => {},
                             applyAction = () => {}} : PlayerItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      className="p-2 m-2 lg:rounded-2xl bg-gray-50"
    >
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{ width: 28, height: 28, borderRadius: 16, backgroundColor: 'black' }} />
        &nbsp;&nbsp;
        <div>{player.nickname}</div>
      </div>

      <div>
        {applyBtn && <button type="button"
                className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-600">
          <FontAwesomeIcon icon={faCheck} />
          <span className="sr-only">Icon description</span>
        </button>}
        {cancelBtn && <button type="button"
                className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
          <FontAwesomeIcon icon={faRemove} />
          <span className="sr-only">Icon description</span>
        </button>}
      </div>
    </div>
  )
}