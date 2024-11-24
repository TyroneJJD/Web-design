import { renderFile, configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { Blog } from "../BaseDatos/operaciones_publicaciones.ts";
import { Publicacion } from "../BaseDatos/operaciones_publicaciones.ts";

export async function mostrarPaginaEditorTexto(context: Context) {
  const html = await renderFile("editorTexto.html", {});
  context.response.body = html || "Error al renderizar la página";
}

export async function guardarPublicacion(context: Context) {
  const result = await context.request.body();
  if (!result.value) {
    context.response.status = 400;
    context.response.body = "Invalid request body";
    return;
  }
  const body = await (await result.value).read();
  const titulo = body.fields.titulo || "";
  const etiquetas =
    body.fields.etiquetas?.split(",").map((tag: string) => tag.trim()) || [];
  const autor = body.fields.autor || "";
  const contenido = body.fields.contenido || "";

  const newPost: Publicacion = {
    titulo,
    etiquetas,
    autor,
    contenido,
  };

  const blog = new Blog();
  await blog.guardarPost(newPost);
}

export async function mostrarPublicacion(context: Context, postId: string) {
  const blog = new Blog();
  const post = await blog.obtenerPostPorId(postId);
  if (post) {
    configure({ autoEscape: false });
    const html = await renderFile("vistaPublicacion.html", post);
    context.response.body = html || "Error al renderizar la página";
  } else {
    context.response.body = "Publicación no encontrada";
  }
}
