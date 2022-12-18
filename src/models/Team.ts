import { Player } from './Player';
import { GameResult } from './GameResult';

export type Team = {
  leader: string
  name: string
  members: Player[]
  requests: Player[]
  results: GameResult[]
}
