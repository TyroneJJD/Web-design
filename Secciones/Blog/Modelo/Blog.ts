import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDatos.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import {
  obtenerApellidoUsuario,
  obtenerNombresUsuario,
} from "../../../Servicios/GestorPermisos.ts";

export interface Publicacion {
  tituloPublicacion: string;
  etiquetasPublicacion: string[];
  autorPublicacion: string;
  contenidoPublicacion: string;
  fechaPublicacion: string;
}

export class Blog {
  private db: BaseDeDatosMongoDB;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.guardarPost = this.guardarPost.bind(this);
    this.guardarPublicacion = this.guardarPublicacion.bind(this);
    this.visualizarLecturaPublicacionBlog = this
      .visualizarLecturaPublicacionBlog.bind(this);
    this.obtenerPublicacionesBlog = this.obtenerPublicacionesBlog.bind(this);
    this.visualizarPublicacionesBlog = this.visualizarPublicacionesBlog.bind(
      this,
    );
  }

  // <!----------> La obtencion de los datos del formulario deberia estar en una funcion aparte
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

    const nombreAutor = await obtenerNombresUsuario(context);
    const apellidoAutor = await obtenerApellidoUsuario(context); //Falla en esta línea
    const autorPublicacion = nombreAutor + " " + apellidoAutor || "";
    const contenidoPublicacion = body.fields.contenido || "";

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const anio = fecha.getFullYear();
    const fechaPublicacion = `${dia}/${mes}/${anio}`;

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
      fechaPublicacion,
      contenidoPublicacion,
    };

    await this.guardarPost(newPost);
  }

  private async guardarPost(newPost: Publicacion): Promise<void> {
    await this.db
      .obtenerReferenciaColeccion<Publicacion>("Publicaciones")
      .insertOne(newPost);
  }

  public async visualizarLecturaPublicacionBlog(
    context: Context,
    postId: string,
  ) {
    const post = await this.obtenerPostPorId(postId);
    if (post == null) {
      context.response.status = 500;
      context.response.body = "Error al obtener las publicaciones";
      return;
    }
    configure({ autoEscape: false });
    const html = await renderizarVista(
      "lecturaPublicacionBlog.html",
      { publicacion: post },
      directorioVistaSeccionActual + `/html_Blog`,
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
      directorioVistaSeccionActual + `/html_Blog`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async visualizarEditorTexto(context: Context) {
    const html = await renderizarVista(
      "editorTexto.html",
      {},
      directorioVistaSeccionActual + `/html_Blog`,
    );
    context.response.body = html || "Error al renderizar la página";
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
