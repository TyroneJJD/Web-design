import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,
  renderizarVista,
} from "../../../utilidadesServidor.ts";
import { verificadorAutenticacion, obtenerDatosToken } from "../../../Servicios/Autenticacion.ts";

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PanelAdministrador/Vista_PanelAdministrador`;

export function inicializarPanelAdministrador(
  router: Router,
  app: Application
) {
  router.get("/protected", verificadorAutenticacion, mostrarPaginaProtegida);

  app.use(
    cargarArchivosEstaticos("/css_PanelAdministrador", directorioVistaSeccionActual + `/css_PanelAdministrador`)
  );
  app.use(cargarArchivosEstaticos("/js_PanelAdministrador", directorioVistaSeccionActual + `/js_PanelAdministrador`));
}

async function mostrarPaginaProtegida(context: Context) {
  try {
    const tokenDatos = await obtenerDatosToken(context);

    if (!tokenDatos) {
      context.response.redirect("/login");
      return;
    }

    const html = await renderizarVista(
      "panelGeneral.html",
      { user: tokenDatos }, 
      directorioVistaSeccionActual + `/html_PanelAdministrador`
    );

    context.response.body = html || "Error al renderizar la página";
  } catch (error) {
    console.error("Error al mostrar la página protegida:", error);
    context.response.status = 500;
    context.response.body = "Ocurrió un error al procesar la solicitud.";
  }
}
