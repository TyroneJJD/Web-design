import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDatos.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";


  // <!----------> Y esto para que sirve???
export class modificadorUsuarios {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
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
