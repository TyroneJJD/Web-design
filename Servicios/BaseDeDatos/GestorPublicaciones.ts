import { BaseDeDatos } from "./BaseDeDatos.ts";
import { Publicacion } from "./Publicacion.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

export class GestorPublicaciones {
  private db: BaseDeDatos;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
  }

  public async guardarPost(newPost: Publicacion): Promise<void> {
    await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .insertOne(newPost);
  }

  public async obtenerPublicacionesBlog(): Promise<Publicacion[]> {
    const publicaciones = await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .find({})
      .toArray();
    return publicaciones;
  }

  public async obtenerPostPorId(postId: string): Promise<Publicacion | null> {
    if (!ObjectId.isValid(postId)) {
      console.error("ID de post inválido:", postId);
      return null;
    }

    const post = await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .findOne({ _id: new ObjectId(postId) });

    if (post) {
      return post;
    } else {
      return null;
    }
  }
}
