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

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/ProblemasProgramacionCompetitiva/Vista_ProblemasProgramacionCompetitiva`;

export function inicializarProblemasProgramacionCompetitiva(
  router: Router,
  app: Application
) {
  router.get("/ProblemasProgramacionCompetitiva", prueba2);

  app.use(
    cargarArchivosEstaticos("/css_ProblemasProgramacionCompetitiva", directorioVistaSeccionActual + `/css_ProblemasProgramacionCompetitiva`)
  );
  app.use(cargarArchivosEstaticos("/js_ProblemasProgramacionCompetitiva", directorioVistaSeccionActual + `/js_ProblemasProgramacionCompetitiva`));
}

async function prueba2(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html`
  );
  context.response.body = html || "Error al renderizar la página";
}
