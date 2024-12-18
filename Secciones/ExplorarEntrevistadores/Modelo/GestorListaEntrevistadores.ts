import { Collection } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDatos.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";

import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";

export class GestorListaEntrevistadores {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios",
    ) as unknown as Collection<IUsuario>;
    this.obtenerEntrevistadores = this.obtenerEntrevistadores.bind(this);
    this.visualizarExplorarEntrevistadores = this
      .visualizarExplorarEntrevistadores.bind(this);
  }

  // <!----------> Requiere reparacion debido al cambio en el modelo de datos
  private async obtenerEntrevistadores(): Promise<IUsuario[]> {
    const entrevistadores = await this.collection
      .find({ "permisosUsuario.esCoach": true })
      .toArray();
    return entrevistadores;
  }

  public async visualizarExplorarEntrevistadores(context: Context) {
    const entrevistadores = await this.obtenerEntrevistadores();

    const html = await renderizarVista(
      "explorar.html",
      { coaches: entrevistadores }, // Asegúrate de que 'coaches' se pasa como una propiedad
      directorioVistaSeccionActual + `/html_ExplorarEntrevistadores`,
    );

    context.response.body = html || "Error al renderizar la página";
  }
}
