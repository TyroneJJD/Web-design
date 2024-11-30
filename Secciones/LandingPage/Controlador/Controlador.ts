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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/LandingPage/Vista_LandingPage`;

export function inicializarLandingPage(router: Router, app: Application) {
  router.get("/LandingPage", prueba2);

  app.use(
    cargarArchivosEstaticos("/css_LandingPage", directorioVistaSeccionActual + `/css_LandingPage`)
  );
  app.use(cargarArchivosEstaticos("/js_LandingPage", directorioVistaSeccionActual + `/js_LandingPage`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html_LandingPage`
  );
  context.response.body = html || "Error al renderizar la página";
}
