import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { Blog } from "../BaseDatos/Blog.ts";

export async function mostrarPaginaEditorTexto(context: Context) {
  const html = await renderFile("editorTexto.html", {});
  context.response.body = html || "Error al renderizar la página";
}

export async function mostrarPublicacion(context: Context) {
  const blog = new Blog();
  const post = await blog.obtenerPostPorId(context);
  if (post) {
    context.response.body = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.titulo}</title>
      </head>
      <body>
        <h1>${post.titulo}</h3>
        <h3>${post.autor}</h3>
        <h3>${post.etiquetas}</h3>
        <div>${post.contenido}</div>
      </body>
      </html>
    `;
  } else {
    context.response.status = 404;
    context.response.body = "Content not found";
  }
}
