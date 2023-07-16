import { Opinion } from "src/app/opinion";
import { Utilizador } from "./utilizador";

export interface Rating {
    _id?: String;
    rank: number;
    message: string;
    likes:number;
    dislikes:number;
    opinion:Opinion[];
    user: Utilizador;
}
  