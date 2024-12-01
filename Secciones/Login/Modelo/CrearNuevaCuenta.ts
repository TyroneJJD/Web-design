import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class crearNuevaCuenta {
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


  public async mostrarPaginaFormularioRegistro(context: Context) {
    const html = await renderizarVista(
      "formulario_registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async mostrarPaginaRegistro(context: Context) {
    const html = await renderizarVista(
      "registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`
    );
    context.response.body = html || "Error al renderizar la página";
  }
}
