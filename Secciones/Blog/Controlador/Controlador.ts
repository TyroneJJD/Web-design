import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { Blog } from "../Modelo/Blog.ts";
import { verificadorAutenticacion , verificarSiPuedePublicarEnBlog} from "../../../Servicios/GestorPermisos.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Blog/Vista_Blog`;

export function inicializarBlog(router: Router, app: Application) {
  const blog = new Blog();
  router.get("/BlogV2", verificadorAutenticacion, verificarSiPuedePublicarEnBlog, blog.visualizarEditorTexto);
  router.post("/save-content", verificadorAutenticacion, verificarSiPuedePublicarEnBlog,  blog.guardarPublicacion);


  // <!----------> No deberia existir logica de negocio aqui, unicamente incocaciones de metodos
  router.get("/lecturaPublicacionBlog", async (context) => {

    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");

    if (id) {
      await blog.visualizarLecturaPublicacionBlog(context, id);
    } else {
      context.response.status = 400;
      context.response.body = { error: "Missing id parameter" };
    }

  });

  router.get("/listaPublicaciones", verificadorAutenticacion, blog.visualizarPublicacionesBlog);

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
