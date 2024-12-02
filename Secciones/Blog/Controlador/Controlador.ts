import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { Blog } from "../Modelo/Blog.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Blog/Vista_Blog`;

export function inicializarBlog(router: Router, app: Application) {
  const blog = new Blog();
  router.get("/BlogV2", blog.visualizarEditorTexto);
  router.post("/save-content", blog.guardarPublicacion);

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
