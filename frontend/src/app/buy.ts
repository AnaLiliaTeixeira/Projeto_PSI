import {Game} from "./game";

export interface Buy {
  _id: string;
  game: Game;
  date: Date;
}