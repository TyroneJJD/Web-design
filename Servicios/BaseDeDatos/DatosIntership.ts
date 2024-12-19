import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

export interface IOfertaIntership {
  _id?: ObjectId;
  compania: string;
  rol: string;
  locacion: string;
  linkFuentePublicacion: string;
  fechaPosteado: string;
}