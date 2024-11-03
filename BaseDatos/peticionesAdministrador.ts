import { ObjectId } from "npm:mongodb@6.1.0";
import { Database } from "./database.ts";
import type { IEntrevistador } from "../Modelo/Entrevistador.ts";
import type { IEntrevistado } from "../Modelo/Entrevistado.ts";
import { Collection } from "npm:mongodb@6.1.0";

export class PeticionesAdministrador {
  private db: Database;
  private referenceColeccion: Collection<IEntrevistador>;

  constructor() {
    this.db = Database.getInstance();
    this.referenceColeccion =
      this.db.getReferenceToCollection<IEntrevistador>("Entrevistador");
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

    const result = await this.referenceColeccion.insertOne(nuevoEntrevistador);
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
      .getReferenceToCollection<IEntrevistado>("Entrevistado")
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

    const entrevistador = await this.referenceColeccion.findOne(filtro);
    return entrevistador;
  }

  public async recuperarDatosEntrevistado(
    correoElectronicoEntrevistado: string,
    contrasenia: string
  ): Promise<IEntrevistado | null> {
    const user = await this.db
      .getReferenceToCollection<IEntrevistado>("Entrevistado")
      .findOne({ correoElectronicoEntrevistado, contrasenia });
    return user;
  }
}
