import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,
  renderizarVista,
} from "../../../utilidadesServidor.ts";

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Blog/Vista_Blog`;

export function inicializarBlog(router: Router, app: Application) {
  router.get("/Blog", prueba1);

  app.use(
    cargarArchivosEstaticos(
      "/Secciones/Blog/Vista/css_Blog",
      directorioVistaSeccionActual + `/css_Blog`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/Secciones/Blog/Vista/js_Blog",
      directorioVistaSeccionActual + `/js_Blog`
    )
  );
}

async function prueba1(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html_Blog`
  );
  context.response.body = html || "Error al renderizar la página";
}
