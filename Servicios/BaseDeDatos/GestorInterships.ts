import { BaseDeDatos } from "./BaseDeDatos.ts";
import { IOfertaIntership } from "./DatosIntership.ts";
import { Collection } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

export class GestorInterships {
  private collection: Collection<IOfertaIntership>;
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IOfertaIntership>(
      "Interships",
    ) as unknown as Collection<IOfertaIntership>;
  }

  public async obtenerOfertaEspecifica(
    nombreCompania: string,
  ): Promise<IOfertaIntership[]> {
    const ofertasDB = await this.collection
      .find({
        compania: { $regex: new RegExp(nombreCompania, "i") },
      })
      .toArray();

    return ofertasDB;
  }

  public async obtenerOfertasIntershipsV2(): Promise<IOfertaIntership[]> {
    const documentos = await this.collection
      .aggregate([
        { $sample: { size: 30 } }, // Obtiene 30 documentos aleatorios
      ])
      .toArray();
    return documentos;
  }

  public async guardarOfertaIntership(
    ofertaDeIntership: IOfertaIntership,
  ): Promise<IOfertaIntership | null> {
    try {
      const result = await this.collection.insertOne(ofertaDeIntership);

      return { _id: result, ...ofertaDeIntership };
    } catch (error) {
      console.error("Error al guardar la oferta:", error);
      return null;
    }
  }

  // <!----------> Necesita ser reparado debido al cambio de ubicacion
  /*
  public async actualizarOfertasInterships(): Promise<void> {
    await this.db.borrarTodosLosDocumentos("Interships");
    const interships = await this.obtenerInterships_SimplifyJobs();
    interships.forEach(async (intership) => {
      await this.guardarOfertaIntership(intership);
    });
  }*/
}
