import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";

export class GestorListaEntrevistadores {
  private gestorDatosUsuario: GestorDatosUsuario;

  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();

    this.visualizarExplorarEntrevistadores = this
      .visualizarExplorarEntrevistadores.bind(this);
  }

  // <!----------> Requiere reparacion debido al cambio en el modelo de datos

  public async visualizarExplorarEntrevistadores(context: Context) {
    const entrevistadores = await this.gestorDatosUsuario
      .obtenerEntrevistadores();

    const html = await renderizarVista(
      "explorar.html",
      { coaches: entrevistadores }, // Asegúrate de que 'coaches' se pasa como una propiedad
      directorioVistaSeccionActual + `/html_ExplorarEntrevistadores`,
    );

    context.response.body = html || "Error al renderizar la página";
  }
}
