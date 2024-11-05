import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

export async function mostrarPaginaInicio(context: Context) {
  const data = { title: "Página Principal", nombre: "Pedro" };
  const html = await renderFile("index.html", data);
  context.response.body = html || "Error al renderizar la página";
}

export async function mostrarPaginaProtegida(context: Context) {
  const html = await renderFile("protected.html", { user: context.state.user });
  context.response.body = html || "Error al renderizar la página";
}
