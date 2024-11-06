import { BaseDeDatos } from "./database.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

interface Publicacion {
  titulo: string;
  etiquetas: string[];
  autor: string;
  contenido: string;
}

export class Blog {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async guardarPost(ctx: Context): Promise<void> {
    const result = await ctx.request.body();
    console.log(result.type);


    if (result.type === "form-data") {
      const body = await result.value.read(); // Obtiene el valor del cuerpo del formulario
      const titulo = body.fields.titulo || "";
      const etiquetas = body.fields.etiquetas?.split(",").map((tag: string) => tag.trim()) || [];
      const autor = body.fields.autor || "";
      const contenido = body.fields.contenido || "";

      const newPost: Publicacion = {
        titulo,
        etiquetas,
        autor,
        contenido,
      };
      const insertedId = await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .insertOne(newPost);

    ctx.response.status = 201;
    ctx.response.body = { message: "Publicación guardada", id: insertedId };
    } else {
      console.log("Formato de cuerpo no soportado.");
    }

   
   

   
  }

  private async obtenerDatosFormularioPublicacion(
    ctx: Context
  ): Promise<{ titulo: string; etiquetas: string[]; autor: string; contenido: string } | null> {
    const result = await ctx.request.body();

    if (result.type === "form") {
      const body = await result.value;
      const titulo = body.get("titulo") || "";
      const etiquetas = (body.get("etiquetas") || "").split(",").map(tag => tag.trim());
      const autor = body.get("autor") || "";
      const contenido = body.get("contenido") || "";

      return { titulo, etiquetas, autor, contenido };
    }

    return null; // Devuelve null si el formato no es soportado
  }

  public async obtenerPostPorId(context: Context): Promise<Publicacion | null> {
    const id = context.request.url.searchParams.get("id");

    if (!id) {
      context.response.status = 400;
      context.response.body = { message: "ID not provided" };
      //return;
    }

    const post = id
      ? await this.db
          .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
          .findOne({ _id: new ObjectId(id) })
      : null;

    if (post) {
      context.response.status = 200;
      context.response.body = post;
    } else {
      context.response.status = 404;
      context.response.body = { message: "Post not found" };
    }
    return post;
  }
}
