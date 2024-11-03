import { ObjectId } from "npm:mongodb@6.1.0";
import { SesionEntrevista } from "./Agenda.ts";

export interface IEntrevistador {
  _id?: ObjectId;
  nombreEntrevistador: string;
  correoElectronicoEntrevistador: string;
  afiliacionEntrevistador: string;
  calendarioEntrevistador?: SesionEntrevista[];
}
