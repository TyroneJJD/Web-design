import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/ControladorPermisos.ts";
import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";

export class GestorPermisos {
  private gestorDatosUsuario: GestorDatosUsuario;
  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();

    this.mostrarPanelPermisosUsuarios = this.mostrarPanelPermisosUsuarios.bind(
      this,
    );
  }

  public async mostrarPanelPermisosUsuarios(context: Context) {
    const usuariosX = await this.gestorDatosUsuario
      .recuperarUsuariosQueSonCandidatosACoach();
    const html = await renderizarVista(
      "panelPermisosUsuarios.html",
      { usuarios: usuariosX },
      directorioVistaSeccionActual + `/html_PanelAdministrador`,
    );

    context.response.body = html || "Error al renderizar la página";
  }
}
