import { GameResult } from '../../models/GameResult';

interface GameCardProps {
  result: GameResult
}
export function GameCard({ result } : GameCardProps) {
  return (
    <div className="rounded-xl bg-amber-500 w-24 p-2 m-2">
      {result.game.title}
      &nbsp;
      {result.result}
    </div>
  )
}