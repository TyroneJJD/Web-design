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
  router.get("/LandingPage", index);
  router.get("/VisionYMision", visionYMision);

  app.use(
    cargarArchivosEstaticos("/css_LandingPage", directorioVistaSeccionActual + `/css_LandingPage`)
  );
  app.use(cargarArchivosEstaticos("/js_LandingPage", directorioVistaSeccionActual + `/js_LandingPage`));
}

// <!----------> Esto deberia ir en el modelo
async function index(context: Context) {
  const html = await renderizarVista(
    "index.html",
    {},
    directorioVistaSeccionActual + `/html_LandingPage`
  );
  context.response.body = html || "Error al renderizar la página";
}

// <!----------> Esto deberia ir en el modelo
async function visionYMision(context: Context) {
  const html = await renderizarVista(
    "vision_mision.html",
    {},
    directorioVistaSeccionActual + `/html_LandingPage`
  );
  context.response.body = html || "Error al renderizar la página";
}
