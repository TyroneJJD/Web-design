import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { ObjectId } from "npm:bson@^6.0";
import { IUsuario } from "../../DatosUsuario.ts";

export class GestorPermisos {
  private collection: Collection<IUsuario>;
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
    this.candidatosACoach = this.candidatosACoach.bind(this);
    this.mostrarPanelPermisosUsuarios = this.mostrarPanelPermisosUsuarios.bind(this);
    this.actualizarPermisos = this.actualizarPermisos.bind(this);
    
  }

  private async candidatosACoach(): Promise<IUsuario[]>{
    const usuariosCoach = await this.collection
      .find({ quiereSerCoach: true })
      .toArray();
    return usuariosCoach;
  }

  public async mostrarPanelPermisosUsuarios(context: Context) {
    const usuariosX = await this.candidatosACoach();
    const html = await renderizarVista(
      "panelPermisosUsuarios.html",
      { usuarios: usuariosX },
      directorioVistaSeccionActual + `/html_PanelAdministrador`
    );

    context.response.body = html || "Error al renderizar la página";
  }


  public async actualizarPermisos(idUsuario: string, permiso: string, estado: boolean): Promise<string> {
    try {
        if (!ObjectId.isValid(idUsuario)) {
            return 'ID de usuario no válido';
        }

        const updateResult = await this.collection.updateOne(
            { _id: new ObjectId(idUsuario) }, 
            { $set: { [permiso]: estado } }
        );

        if (updateResult.modifiedCount > 0) {
            return 'Permiso actualizado correctamente';
        } else {
            return 'No se pudo actualizar el permiso';
        }
    } catch (error) {
        console.error(error);
        return 'Error al actualizar el permiso';
    }
}


}
