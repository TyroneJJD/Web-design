import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { ObjectId } from "npm:mongodb@6.1.0";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import {configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";

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
    this.guardarPost = this.guardarPost.bind(this);
    this.guardarPublicacion = this.guardarPublicacion.bind(this);
    this.visualizarLecturaPublicacionBlog = this.visualizarLecturaPublicacionBlog.bind(this);
    this.obtenerPublicacionesBlog = this.obtenerPublicacionesBlog.bind(this);
    this.visualizarPublicacionesBlog = this.visualizarPublicacionesBlog.bind(this);
  }

  public async guardarPublicacion(context: Context) {
    const result = await context.request.body();
    if (!result.value) {
      context.response.status = 400;
      context.response.body = "Invalid request body";
      return;
    }
    const body = await (await result.value).read();
    const tituloPublicacion = body.fields.titulo || "";
    const etiquetasPublicacion =
      body.fields.etiquetas?.split(",").map((tag: string) => tag.trim()) || [];
    const autorPublicacion = body.fields.autor || "";
    const contenidoPublicacion = body.fields.contenido || "";

    if (contenidoPublicacion.length === 0 || contenidoPublicacion === "") {
      context.response.status = 400;
      context.response.body =
        "El contenido de la publicación no puede estar vacío";
      return;
    }

    const newPost: Publicacion = {
      tituloPublicacion,
      etiquetasPublicacion,
      autorPublicacion,
      contenidoPublicacion,
    };

    await this.guardarPost(newPost);
  }

  private async guardarPost(newPost: Publicacion): Promise<void> {
    await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .insertOne(newPost);
  }

  public async visualizarLecturaPublicacionBlog(context: Context, postId: string) {
    const post = await this.obtenerPostPorId(postId);
    if (post == null) {
      context.response.status = 500;
      context.response.body = "Error al obtener las publicaciones";
      return;
    }
    configure({ autoEscape: false });
    const html = await renderizarVista(
      "lecturaPublicacionBlog.html",
      {publicacion: post},
      directorioVistaSeccionActual + `/html_Blog`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  private async obtenerPublicacionesBlog(): Promise<Publicacion[]> {
    const publicaciones = await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .find({})
      .toArray();
    return publicaciones;
  }

  public async visualizarPublicacionesBlog(context: Context) {
    const publicaciones = await this.obtenerPublicacionesBlog();
    if (publicaciones == null) {
      context.response.status = 500;
      context.response.body = "Error al obtener las publicaciones";
      return;
    }
    const html = await renderizarVista(
      "ListaDeBlogs.html",
      { publicaciones: publicaciones },
      directorioVistaSeccionActual + `/html_Blog`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  

  public async visualizarEditorTexto(context: Context) {
    const html = await renderizarVista(
      "editorTexto.html",
      {},
      directorioVistaSeccionActual + `/html_Blog`
    );
    context.response.body = html || "Error al renderizar la página";
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
