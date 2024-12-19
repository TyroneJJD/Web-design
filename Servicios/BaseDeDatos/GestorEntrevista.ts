import { BaseDeDatos } from "./BaseDeDatos.ts";
import { ISesionEntrevista } from "./Entrevistas.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

export class GestorEntrevista {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async obtenerReunionesCreadasPorElEntrevistador(
    idEntrevistador: string,
  ): Promise<ISesionEntrevista[]> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    ) as unknown as Collection<ISesionEntrevista>;

    return await collection
      .find({ idCoach: idEntrevistador })
      .sort({ horaInicio: 1 }) // 1 para ascendente, -1 para descendente
      .toArray();
  }

  public async obtenerTodosLosDatosDeLaReunionPorID(
    idSesion: string,
  ): Promise<ISesionEntrevista> {
    const collection =
      (await this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
        "Reuniones",
      )) as unknown as Collection<ISesionEntrevista>;
    const dato = await collection.findOne({
      _id: new ObjectId(idSesion).toString(),
    });
    if (!dato) {
      throw new Error(`Sesión con ID ${idSesion} no encontrada`);
    }
    return dato;
  }

  public async actualizarReunion(
    reunionActualizada: ISesionEntrevista,
  ): Promise<void> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    ) as unknown as Collection<ISesionEntrevista>;
    const { _id, ...datosActualizados } = reunionActualizada;

    await collection.updateOne(
      { _id }, // Filtro por ID de la reunión
      { $set: datosActualizados }, // Datos a actualizar
    );
  }

  public async insertarNuevaReunion(
    nuevaReunion: Omit<ISesionEntrevista, "_id">,
  ): Promise<ISesionEntrevista> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    ) as unknown as Collection<ISesionEntrevista>;
    const result = await collection.insertOne(nuevaReunion);
    return { _id: result.toString(), ...nuevaReunion };
  }

  // <!----------> reparar debido al cambio en el modelo de datos
  public async obtenerReunionesPorCandidato(
    idCandidato: string,
  ): Promise<ISesionEntrevista[]> {
    /*
    // Obtener la referencia a la colección de reuniones
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    ) as unknown as Collection<ISesionEntrevista>;

    // Buscar reuniones donde el candidato esté registrado
    const reuniones = await collection
      .find({ candidatosRegistrados.idCandidatoRegistrado: idCandidato })
      .toArray();

    // Si no se encuentran reuniones, devolver un arreglo vacío
    if (!reuniones || reuniones.length === 0) {
      return [];
    }

    // Retornar las reuniones encontradas
    return reuniones;*/
    return [];
  }

  public async obtenerTodosLosDatosDeLaReunionPorIDV2(
    idSesion: string,
  ): Promise<ISesionEntrevista> {
    const collection =
      (await this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
        "Reuniones",
      )) as unknown as Collection<ISesionEntrevista>;
    const dato = await collection.findOne({ _id: new ObjectId(idSesion).toString() });
    console.log(dato);
    if (!dato) {
      throw new Error(`Sesión con ID ${idSesion} no encontrada`);
    }
    return dato;
  }

  public async agregarCandidatoAReunion(
    idSesion: string,
    sesion: ISesionEntrevista,
  ): Promise<void> {
    // Obtener la colección con el tipo definido
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    );

    try {
      // Convertir idSesion a ObjectId si es necesario

      // Actualizar el registro en la base de datos
      const resultado = await collection.updateOne(
        { _id: new ObjectId(idSesion) }, // Usar el ObjectId en el filtro
        { $set: { candidatosRegistrados: sesion.candidatosRegistrados } }, // Actualizar el campo
      );

      // Verificar si se actualizó el documento
      if (resultado.matchedCount === 0) {
        throw new Error(`No se encontró una sesión con _id: ${idSesion}.`);
      }

      console.log(`Se actualizó correctamente la sesión con _id: ${idSesion}.`);
    } catch (error) {
      console.error("Error agregando el candidato:", error);
      throw new Error("No se pudo agregar el candidato a la reunión.");
    }
  }

  public async obtenerReunionesCreadasPorElEntrenador(
    idEntrevistador: string,
  ): Promise<ISesionEntrevista[]> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones",
    ) as unknown as Collection<ISesionEntrevista>;

    return await collection
      .find({ idCoach: idEntrevistador })
      .sort({ horaInicio: 1 }) // 1 para ascendente, -1 para descendente
      .toArray();
  }
}
