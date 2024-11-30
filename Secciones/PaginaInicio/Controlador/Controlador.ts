
import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,
  renderizarVista,
} from "../../../utilidadesServidor.ts";

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PaginaInicio/Vista_PaginaInicio`;

export function inicializarPaginaInicio(router: Router, app: Application) {
  router.get("/home", renderizarHome);

  app.use(
    cargarArchivosEstaticos("/css_PaginaInicio", directorioVistaSeccionActual + `/css_PaginaInicio`)
  );
  app.use(cargarArchivosEstaticos("/js_PaginaInicio", directorioVistaSeccionActual + `/js_PaginaInicio`));
}

async function renderizarHome(context: Context) {
  const html = await renderizarVista(
    "home.html",
    {},
    directorioVistaSeccionActual + `/html_PaginaInicio`
  );
  context.response.body = html || "Error al renderizar la página";
}
