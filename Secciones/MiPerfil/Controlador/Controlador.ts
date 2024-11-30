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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/MiPerfil/Vista_MiPerfil`;

export function inicializarMiPerfil(router: Router, app: Application) {
  router.get("/MiPerfil", prueba2);

  app.use(
    cargarArchivosEstaticos("/css_MiPerfil", directorioVistaSeccionActual + `/css_MiPerfil`)
  );
  app.use(cargarArchivosEstaticos("/js_MiPerfil", directorioVistaSeccionActual + `/js_MiPerfil`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html_MiPerfil`
  );
  context.response.body = html || "Error al renderizar la página";
}
