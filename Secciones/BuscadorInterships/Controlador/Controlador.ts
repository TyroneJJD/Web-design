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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/BuscadorInterships/Vista`;

export function inicializarBuscadorInterships(
  router: Router,
  app: Application
) {
  router.get("/BuscadorInterships", prueba2);

  app.use(
    cargarArchivosEstaticos("/css_BuscadorInterships", directorioVistaSeccionActual + `/css_BuscadorInterships`)
  );
  app.use(cargarArchivosEstaticos("/js_BuscadorInterships", directorioVistaSeccionActual + `/js_BuscadorInterships`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html`
  );
  context.response.body = html || "Error al renderizar la página";
}
