import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,
  renderizarVista,
} from "../../../utilidadesServidor.ts";

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PaginaInicio/Vista`;

export function inicializarPaginaInicio(router: Router, app: Application) {
  router.get("/home", renderizarHome);

  app.use(
    cargarArchivosEstaticos("/css", directorioVistaSeccionActual + `/css`)
  );
  app.use(cargarArchivosEstaticos("/js", directorioVistaSeccionActual + `/js`));
}

async function renderizarHome(context: Context) {
  const html = await renderizarVista(
    "home.html",
    {},
    directorioVistaSeccionActual + `/html`
  );
  context.response.body = html || "Error al renderizar la página";
}
