import { User } from './User';
import { GameResult } from './GameResult';

export type Team = {
  creator: User
  name: string
  state: string
  users_in_team: User[]
  requests: User[]
  results: GameResult[]
}
