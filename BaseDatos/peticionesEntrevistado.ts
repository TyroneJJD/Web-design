import { ObjectId } from "npm:mongodb@6.1.0";
import { BaseDeDatos } from "./database.ts";
import { IEntrevistador } from "../BaseDatos/peticionesEntrevistador.ts";
import { SesionEntrevista } from "../Modelo/Agenda.ts";

export interface IEntrevistado {
  _id?: ObjectId;
  nombreEntrevistado: string;
  correoElectronicoEntrevistado: string;
  carreraUniversitariaEntrevistado: string;
  semestreCarreraUniversitariaEntrevistado: number;
  contrasenia: string;
}

//Si les marca un error en la linea 71, ignorenlo
export class PeticionesEntrevistado {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async buscarIdEntrevistador(
    nombreEntrevistador: string,
    correoElectronicoEntrevistador: string
  ): Promise<ObjectId | null> {
    const filtro: Partial<IEntrevistador> = {
      nombreEntrevistador: nombreEntrevistador,
      correoElectronicoEntrevistador: correoElectronicoEntrevistador,
    };

    const entrevistador = await this.db
      .obtenerReferenciaColeccion<IEntrevistado>("Entrevistador")
      .findOne(filtro, {
        projection: { _id: 1 }, // Solo devuelve el campo _id
      });

    return entrevistador ? entrevistador._id : null;
  }

  public async solicitarCalendarioEntrevistador(
    idEntrevistador: ObjectId
  ): Promise<SesionEntrevista[] | null> {
    const filtro: Partial<IEntrevistador> = { _id: idEntrevistador };
    const entrevistador = await this.db
      .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
      .findOne(filtro);

    // Filtrar solo las sesiones donde sesionOcupada es false
    const sesionesDisponibles =
      entrevistador && entrevistador.calendarioEntrevistador
        ? entrevistador.calendarioEntrevistador.filter(
            (sesion) => !sesion.sesionOcupada
          )
        : null;

    return sesionesDisponibles;
  }

  public async inscribirmeASesion(
    idEntrevistador: ObjectId,
    idReunion: string,
    nombreEntrevistado: string,
    correoElectronicoEntrevistado: string
  ): Promise<void> {
    await this.db
      .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
      .updateOne(
        {
          _id: idEntrevistador,
          "calendarioEntrevistador.idReunion": idReunion,
        },
        {
          $set: {
            "calendarioEntrevistador.$.nombreEntrevistado": nombreEntrevistado,
            "calendarioEntrevistador.$.correoElectronicoEntrevistado":
              correoElectronicoEntrevistado,
            "calendarioEntrevistador.$.sesionOcupada": true,
          },
        }
      );
  }

  public async buscarDatosEntrevistado(
    nombreEntrevistado: string,
    correoElectronicoEntrevistado: string
  ): Promise<IEntrevistado | null> {
    const filtro: Partial<IEntrevistado> = {
      nombreEntrevistado: nombreEntrevistado,
      correoElectronicoEntrevistado: correoElectronicoEntrevistado,
    };

    const entrevistador = await this.db
      .obtenerReferenciaColeccion<IEntrevistado>("Entrevistado")
      .findOne(filtro);
    return entrevistador;
  }
}
