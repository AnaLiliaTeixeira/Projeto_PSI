import { Utilizador } from "./utilizador";

export interface Opinion {
  _id?: String;
  message:String;
  user: Utilizador;
}
