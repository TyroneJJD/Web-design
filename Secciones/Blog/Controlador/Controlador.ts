import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,
  renderizarVista,
} from "../../../utilidadesServidor.ts";

const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Blog/Vista`;

export function inicializarBlog(router: Router, app: Application) {
  router.get("/Blog", prueba1);

  app.use(
    cargarArchivosEstaticos(
      "/Secciones/Blog/Vista/css",
      directorioVistaSeccionActual + `/css`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/Secciones/Blog/Vista/js",
      directorioVistaSeccionActual + `/js`
    )
  );
}

async function prueba1(context: Context) {
  const html = await renderizarVista(
    "test.html",
    {},
    directorioVistaSeccionActual + `/html`
  );
  context.response.body = html || "Error al renderizar la página";
}
