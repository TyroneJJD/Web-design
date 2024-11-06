import { BaseDeDatos } from "./database.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { ObjectId } from "npm:mongodb@6.1.0";

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

  public async obtenerPostPorId(postId: string): Promise<Publicacion | null> {
    console.log("Post ID recibido:", postId);
  
    // Verifica que el postId sea un ObjectId válido
    if (!ObjectId.isValid(postId)) {
      console.error("ID de post inválido:", postId);
      return null; // Devuelve null si el ID no es válido
    }
  
    try {
      // Busca el post en la colección "Publicaciones" usando el ObjectId
      const post = await this.db
        .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
        .findOne({ _id: new ObjectId(postId) });
  
      if (post) {
        console.log("Post encontrado:", post);
        return post; // Devuelve el post si se encuentra
      } else {
        console.log("Post no encontrado con ID:", postId);
        return null; // Devuelve null si no se encuentra el post
      }
    } catch (error) {
      console.error("Error al obtener el post:", error);
      return null; // Devuelve null si ocurre un error
    }
  }
}
