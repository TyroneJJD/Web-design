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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/ExplorarEntrevistadores/Vista_ExplorarEntrevistadores`;

export function inicializarExplorarEntrevistadores(
  router: Router,
  app: Application
) {
  router.get("/ExplorarEntrevistadores", prueba2);

  app.use(
    cargarArchivosEstaticos("/css_ExplorarEntrevistadore", directorioVistaSeccionActual + `/css_ExplorarEntrevistadores`)
  );
  app.use(cargarArchivosEstaticos("/js_ExplorarEntrevistadore", directorioVistaSeccionActual + `/js_ExplorarEntrevistadores`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html_ExplorarEntrevistadores`
  );
  context.response.body = html || "Error al renderizar la página";
}
