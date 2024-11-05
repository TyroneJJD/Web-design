import { ObjectId } from "npm:mongodb@6.1.0";
import { BaseDeDatos } from "./database.ts";
import type { SesionEntrevista } from "../Modelo/Agenda.ts";

export interface IEntrevistador {
  _id?: ObjectId;
  nombreEntrevistador: string;
  correoElectronicoEntrevistador: string;
  afiliacionEntrevistador: string;
  calendarioEntrevistador?: SesionEntrevista[];
}

export class PeticionesEntrevistador {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async InsertarNuevoEntrevistador(
    entrevistador: IEntrevistador
  ): Promise<ObjectId> {
    const nuevoEntrevistador: IEntrevistador = {
      nombreEntrevistador: entrevistador.nombreEntrevistador,
      correoElectronicoEntrevistador:
        entrevistador.correoElectronicoEntrevistador,
      afiliacionEntrevistador: entrevistador.afiliacionEntrevistador,
      calendarioEntrevistador: entrevistador.calendarioEntrevistador || [],
    };

    const result = await this.db
      .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
      .insertOne(nuevoEntrevistador);
    return result.insertedId;
  }

  public async buscarDatosEntrevistador(
    nombreEntrevistador: string,
    correoElectronicoEntrevistador: string
  ): Promise<IEntrevistador | null> {
    const filtro: Partial<IEntrevistador> = {
      nombreEntrevistador: nombreEntrevistador,
      correoElectronicoEntrevistador: correoElectronicoEntrevistador,
    };

    const entrevistador = await this.db
      .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
      .findOne(filtro);
    return entrevistador;
  }

  public async agregarSesionAlCalendario(
    idEntrevistador: ObjectId,
    nuevaSesion: SesionEntrevista
  ): Promise<void> {
    // Verificar si la sesión ya existe en `calendarioEntrevistador`
    const entrevistador = await this.db
      .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
      .findOne({
        _id: idEntrevistador,
        calendarioEntrevistador: {
          $elemMatch: {
            horaInicio: nuevaSesion.horaInicio,
            horaFin: nuevaSesion.horaFin,
            nombreEntrevistado: nuevaSesion.nombreEntrevistado,
            correoElectronicoEntrevistado:
              nuevaSesion.correoElectronicoEntrevistado,
          },
        },
      });

    // Si la sesión no existe, agregarla
    if (!entrevistador) {
      await this.db
        .obtenerReferenciaColeccion<IEntrevistador>("Entrevistador")
        .updateOne(
          { _id: idEntrevistador },
          { $push: { calendarioEntrevistador: nuevaSesion } }
        );
    } else {
      console.log("La sesión ya existe en el calendario.");
    }
  }
}
