import { Rating } from "./rating";

export interface Game {
  _id: string;
  name: string;
  game_type: string;
  description: string;
  platform: string;
  idioms: string;
  price: number;
  avarageRating: number;
  ratings: Rating[];
  images: {
    main: string;
    additional: string[];
    video: string;
  }
}