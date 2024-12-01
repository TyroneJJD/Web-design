import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class PerfilPropio {
  public async mostrarPaginaVerMiPerfil(context: Context) {}

  public async mostrarPaginaEditarMiPerfil(context: Context) {
    const html = await renderizarVista(
      "editar_perfil.html",
      {},
      directorioVistaSeccionActual + `/html_MiPerfil`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async editarDatosPerfil(context: Context) {}
  public async editarImagenDePerfil(context: Context) {}
  public async editarBackgroundDePerfil(context: Context) {}
}
