import { ObjectId } from "npm:mongodb@6.1.0";
import { BaseDeDatos } from "./database.ts";
import type { IEntrevistador } from "./peticionesEntrevistador.ts";
import type { IEntrevistado } from "./peticionesEntrevistado.ts";

export class PeticionesAdministrador {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async crearNuevoEntrevistador(
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

  public async crearNuevoEntrevistado(
    entrevistado: IEntrevistado
  ): Promise<ObjectId> {
    const nuevoEntrevistado: IEntrevistado = {
      nombreEntrevistado: entrevistado.nombreEntrevistado,
      correoElectronicoEntrevistado: entrevistado.correoElectronicoEntrevistado,
      carreraUniversitariaEntrevistado:
        entrevistado.carreraUniversitariaEntrevistado,
      semestreCarreraUniversitariaEntrevistado:
        entrevistado.semestreCarreraUniversitariaEntrevistado,
      contrasenia: entrevistado.contrasenia,
    };

    const result = await this.db
      .obtenerReferenciaColeccion<IEntrevistado>("Entrevistado")
      .insertOne(nuevoEntrevistado);
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

  public async recuperarDatosEntrevistado(
    correoElectronicoEntrevistado: string,
    contrasenia: string
  ): Promise<IEntrevistado | null> {
    const user = await this.db
      .obtenerReferenciaColeccion<IEntrevistado>("Entrevistado")
      .findOne({ correoElectronicoEntrevistado, contrasenia });
    return user;
  }
}
