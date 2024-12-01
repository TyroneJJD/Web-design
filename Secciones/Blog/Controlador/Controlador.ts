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
  router.get("/BlogV2", visualizarEditorTexto);

  app.use(
    cargarArchivosEstaticos(
      "/css_Blog",
      directorioVistaSeccionActual + `/css_Blog`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_Blog",
      directorioVistaSeccionActual + `/js_Blog`
    )
  );
}

async function visualizarEditorTexto(context: Context) {
  const html = await renderizarVista(
    "editorTexto.html",
    {},
    directorioVistaSeccionActual + `/html_Blog`
  );
  context.response.body = html || "Error al renderizar la página";
}
