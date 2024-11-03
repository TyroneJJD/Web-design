import { ObjectId } from "npm:mongodb@6.1.0";

export interface IEntrevistado {
  _id?: ObjectId;
  nombreEntrevistado: string;
  correoElectronicoEntrevistado: string;
  carreraUniversitariaEntrevistado: string;
  semestreCarreraUniversitariaEntrevistado: number;
  contrasenia: string;
}
