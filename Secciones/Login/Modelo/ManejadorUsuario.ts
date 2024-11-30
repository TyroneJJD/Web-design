import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { IUsuario } from "../../DatosUsuario.ts";

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
}
