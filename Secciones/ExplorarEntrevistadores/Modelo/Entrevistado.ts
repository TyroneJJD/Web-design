import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import {
  IUsuario,
  ISesionEntrevista,
  ICandidatosRegistrado,
} from "../../DatosUsuario.ts";

export class ManejadorEntrevistado {

  private collection: Collection<IUsuario>;

  constructor() {
    const db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
  }

  public async obtenerEntrevistadorPorId(id: string): Promise<IUsuario> {
    const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public async obtenerAgendaEntrevistadorPorId(
    id: string
  ): Promise<ISesionEntrevista[]> {
    try {
      const usuario = await this.collection.findOne({ _id: new ObjectId(id) });

      if (!usuario) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }

      return usuario.agenda || [];
    } catch (error) {
      console.error("Error al obtener la agenda del usuario:", error);
      throw new Error("No se pudo obtener la agenda.");
    }
  }

  //Incribirme a sesion
  public async postularmeASesion(
    idEntrevistador: string,
    idReunionDeseadaAInscribirse: string,
    datosPropios: ICandidatosRegistrado
  ): Promise<boolean> {
    try {
      const usuario = await this.collection.findOne({
        _id: new ObjectId(idEntrevistador),
      });

      if (!usuario) {
        throw new Error(`Usuario con ID ${idEntrevistador} no encontrado`);
      }

      // Buscar la sesión en la agenda del usuario
      const sesion = usuario.agenda.find(
        (sesion) => sesion.idReunion === idReunionDeseadaAInscribirse
      );

      if (!sesion) {
        throw new Error(
          `Sesión con ID ${idReunionDeseadaAInscribirse} no encontrada en la agenda del usuario`
        );
      }

      // Verificar si la sesión está ocupada
      if (sesion.sesionAsignada) {
        throw new Error("La sesión ya está ocupada.");
      }

      // Verificar si el candidato ya está registrado en la sesión
      const candidatoExistente = sesion.candidatosRegistrados.some(
        (c) =>
          c.correoElectronicoCandidatoAEntrevistar ===
          datosPropios.correoElectronicoCandidatoAEntrevistar
      );

      if (candidatoExistente) {
        throw new Error("El candidato ya está inscrito en esta sesión.");
      }

      // Agregar el nuevo candidato a la lista de candidatos registrados
      sesion.candidatosRegistrados.push(datosPropios);

      // Actualizar la agenda del usuario en la base de datos
      await this.collection.updateOne(
        { _id: new ObjectId(idEntrevistador) },
        { $set: { agenda: usuario.agenda } }
      );

      return true; // Candidato agregado exitosamente
    } catch (error) {
      console.error("Error al agregar candidato a la sesión:", error);
      return false; // Error durante el proceso
    }
  }
}
