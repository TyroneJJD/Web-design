import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { SesionEntrevista } from "./Agenda.ts";

export interface IUsuario {
  _id?: ObjectId;

  nombreUsuario: string;
  correoElectronicoUsuario: string;
  contraseniaUsuario: string;
  fechaNacimientoUsuario: Date;

  universidadUsuario: string;
  carreraUniversitariaUsuario: string;

  esAdministrador: boolean;
  esCoach: boolean;
  puedePublicarEnElBlog: boolean;
  puedePublicarProblemas: boolean;

  agenda: SesionEntrevista[];
}

export class ManejadorUsuario {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
  }

  public async crearNuevoUsuario(
    usuario: Omit<IUsuario, "_id">
  ): Promise<IUsuario> {
    // Por seguridad todo usuario nuevo inicia con permisos desactivados
    usuario.esAdministrador = false;
    usuario.esCoach = false;
    usuario.puedePublicarEnElBlog = false;
    usuario.puedePublicarProblemas = false;

    const result = await this.collection.insertOne(usuario);
    return { _id: result, ...usuario };
  }

  public async obtenerUsuarioPorId(id: string): Promise<IUsuario> {
    const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public async obtenerTodosLosUsuarios(): Promise<IUsuario[]> {
    return await this.collection.find().toArray();
  }

  public async actualizarUsuarioPorId(
    id: string,
    datosActualizados: Partial<Omit<IUsuario, "_id">>
  ): Promise<IUsuario | null> {
    const { matchedCount } = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: datosActualizados }
    );

    if (matchedCount === 0) {
      return null;
    }

    return await this.obtenerUsuarioPorId(id);
  }

  public async eliminarUsuarioPorId(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(id),
      });

      return result === 1; // Verificar si la eliminación fue exitosa
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      return false;
    }
  }
}
