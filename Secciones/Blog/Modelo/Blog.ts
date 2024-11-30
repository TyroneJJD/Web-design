import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { ObjectId } from "npm:mongodb@6.1.0";

export interface Publicacion {
  tituloPublicacion: string;
  etiquetasPublicacion: string[];
  autorPublicacion: string;
  contenidoPublicacion: string;
}

export class Blog {
  private db: BaseDeDatosMongoDB;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
  }

  public async guardarPost(newPost: Publicacion): Promise<void> {
    await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .insertOne(newPost);
  }

  public async obtenerPostPorId(postId: string): Promise<Publicacion | null> {
    if (!ObjectId.isValid(postId)) {
      console.error("ID de post inválido:", postId);
      return null; // Devuelve null si el ID no es válido
    }

    const post = await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .findOne({ _id: new ObjectId(postId) });

    if (post) {
      return post; // Devuelve el post si se encuentra
    } else {
      return null; // Devuelve null si no se encuentra el post
    }
  }
}
