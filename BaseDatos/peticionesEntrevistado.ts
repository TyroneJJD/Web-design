import { ObjectId } from "npm:mongodb@6.1.0";
import { Database } from "./database.ts";
import type { IEntrevistado } from "../Modelo/Entrevistado.ts";
import { Collection } from "npm:mongodb@6.1.0";
import { IEntrevistador } from "../Modelo/Entrevistador.ts";
import { SesionEntrevista } from "../Modelo/Agenda.ts";

//Si les marca un error, ignorenlo
export class PeticionesEntrevistado {
  private db: Database;
  private referenceColeccion: Collection<IEntrevistado>;

  constructor() {
    this.db = Database.getInstance();
    this.referenceColeccion =
      this.db.getReferenceToCollection<IEntrevistado>("Entrevistado");
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
      .getReferenceToCollection<IEntrevistado>("Entrevistador")
      .findOne(filtro, {
        projection: { _id: 1 }, // Solo devuelve el campo _id
      });

    return entrevistador ? entrevistador._id : null;
  }

  public async pedirCalendarioEntrevistador(
    idEntrevistador: ObjectId
  ): Promise<SesionEntrevista[] | null> {
    const filtro: Partial<IEntrevistador> = { _id: idEntrevistador };
    const entrevistador = await this.db
      .getReferenceToCollection<IEntrevistador>("Entrevistador")
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
      .getReferenceToCollection<IEntrevistador>("Entrevistador")
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

    const entrevistador = await this.referenceColeccion.findOne(filtro);
    return entrevistador;
  }
}
