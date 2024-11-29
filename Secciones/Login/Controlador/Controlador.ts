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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Login/Vista`;

export function inicializarLogin(router: Router, app: Application) {
  router.get("/Login", prueba2);

  app.use(
    cargarArchivosEstaticos("/css", directorioVistaSeccionActual + `/css`)
  );
  app.use(cargarArchivosEstaticos("/js", directorioVistaSeccionActual + `/js`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html`
  );
  context.response.body = html || "Error al renderizar la página";
}
