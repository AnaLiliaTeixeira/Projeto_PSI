import { Buy } from './buy';
import { Game } from './game';

export interface Utilizador {
  _id: string;
  name: string;
  password: string;
  following: Utilizador[];
  followers: Utilizador[];
  buys: Buy[];
  wishlist: Game[];
  imageProfile: string;
}