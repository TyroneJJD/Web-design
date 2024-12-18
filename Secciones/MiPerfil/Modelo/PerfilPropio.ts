import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDatos.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";
import { obtenerIdUsuario } from "../../../Servicios/GestorPermisos.ts";
import { ManejadorArchivos } from "../../../Servicios/ManejadorArchivos.ts";

// <!----------> Esta clase se deben separar en tres clases diferentes, para respetar sus ADTs
export class PerfilPropio {
  private collection: Collection<IUsuario>;
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios",
    ) as unknown as Collection<IUsuario>;

    this.obtenerUsuarioPorId = this.obtenerUsuarioPorId.bind(this);
    this.mostrarPaginaEditarMiPerfil = this.mostrarPaginaEditarMiPerfil.bind(
      this,
    );
    this.editarDatosPerfil = this.editarDatosPerfil.bind(this);
    this.mostrarPaginaVerMiPerfil = this.mostrarPaginaVerMiPerfil.bind(this);
    this.mostrarPaginaVerPerfil = this.mostrarPaginaVerPerfil.bind(this);
    this.editarDatosPerfil = this.editarDatosPerfil.bind(this);
  }

  public async mostrarPaginaVerMiPerfil(context: Context) {
    const idUsuario = await obtenerIdUsuario(context); //metodoLocal es obtenido de la cookie
    if (!idUsuario) {
      context.response.status = 401;
      context.response.body = "No se proporcionó un ID de usuario";
      return;
    }
    const datosUsuario = await this.obtenerUsuarioPorId(idUsuario);
    const html = await renderizarVista(
      "ver_perfil.html",
      { usuario: datosUsuario, esMiPerfil: true },
      directorioVistaSeccionActual + `/html_MiPerfil`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async mostrarPaginaVerPerfil(context: Context) {
    const idUsuario = await obtenerIdUsuario(context); //metodoLocal es obtenido de la cookie
    const idSolicitado = this.obtenerIdSolicitado(context);
    let esMiPerfil = false;

    if (!idUsuario) {
      context.response.status = 401;
      context.response.body = "No se proporcionó un ID de usuario";
      return;
    }

    if (!idSolicitado) {
      context.response.status = 401;
      context.response.body = "No se proporcionó un ID de perfil";
      return;
    }

    if (idUsuario === idSolicitado) {
      esMiPerfil = true;
    }

    const datosUsuario = await this.obtenerUsuarioPorId(idSolicitado);
    const html = await renderizarVista(
      "ver_perfil.html",
      { usuario: datosUsuario, esMiPerfil: esMiPerfil },
      directorioVistaSeccionActual + `/html_MiPerfil`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  private obtenerUsuarioPorId = async (id: string) => {
    try {
      const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
      return usuario;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  };

  public async mostrarPaginaEditarMiPerfil(context: Context) {
    const idUsuario = await obtenerIdUsuario(context);
    if (!idUsuario) {
      context.response.status = 401;
      context.response.body = "No se proporcionó un ID de usuario";
      return;
    }
    const datosUsuario = await this.obtenerUsuarioPorId(idUsuario);

    const html = await renderizarVista(
      "editar_perfil.html",
      { usuario: datosUsuario },
      directorioVistaSeccionActual + `/html_MiPerfil`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async editarDatosPerfil(context: Context) {
    try {
      if (!context.request.hasBody) {
        context.response.status = 400;
        context.response.body = { error: "No se enviaron datos" };
        return;
      }

      const body = await context.request.body({ type: "json" }).value;
      const infoTexto = body.infoCampos; // Accede a infoCampos del objeto JSON
      const infoImagenes = body.infoImagenes;
      console.log(infoImagenes);

      const idUsuario = await obtenerIdUsuario(context);

      if (!idUsuario) {
        context.response.status = 400;
        context.response.body = { error: "ID de usuario no proporcionado" };
        return;
      }

      const UsuarioActualizado = await this.ActualizaUsuario(
        infoTexto,
        idUsuario,
      );
      const ImagenesActualizadas = await this.ActualizaImagenes(
        infoImagenes,
        idUsuario,
      );

      if (!UsuarioActualizado) {
        context.response.status = 404;
        context.response.body = {
          error: "Usuario no encontrado o no modificado",
        };
        return;
      }

      if (!ImagenesActualizadas.FotoPerfilProcesada) {
        context.response.status = 404;
        context.response.body = {
          error: "Error en carga de imagen de perfil",
        };
        return;
      }

      if (!ImagenesActualizadas.FotoBackgroundProcesada) {
        context.response.status = 404;
        context.response.body = {
          error: "Error en carga de imagen de background",
        };
        return;
      }

      context.response.status = 200;
      context.response.body = { message: "Perfil actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      context.response.status = 500;
      context.response.body = { error: "Error interno del servidor" };
    }
  }

  private obtenerIdSolicitado(context: Context): string | null {
    const url = context.request.url;
    const params = url.searchParams;
    const idPerfil = params.get("perfil");
    return idPerfil;
  }

  private async ActualizaImagenes(archivoJSON: any, idUsuario: string) {
    const manejadorArchivos = new ManejadorArchivos();
    let urlNuevaFotoPerfil;
    let urlNuevaFotoBackground;

    const FotoPerfil = archivoJSON.imagenPerfil;
    const FotoBackground = archivoJSON.imagenBackground;

    console.log(FotoPerfil);
    console.log(FotoBackground);

    let FotoPerfilProcesada;
    let FotoBackgroundProcesada;

    if (FotoPerfil.fileName == "") {
      FotoPerfilProcesada = true;
    } else {
      urlNuevaFotoPerfil = await manejadorArchivos.guardarFotoDePerfil(
        FotoPerfil,
        idUsuario,
      );
      const result = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        {
          $set: {
            direccionURLFotoPerfil: urlNuevaFotoPerfil ?? "",
          },
        },
      );

      FotoPerfilProcesada = result.modifiedCount !== 0;
    }

    if (FotoBackground.fileName == "") {
      FotoBackgroundProcesada = true;
    } else {
      urlNuevaFotoBackground = await manejadorArchivos.guardarFotoDeBackground(
        FotoBackground,
        idUsuario,
      );
      const result = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        {
          $set: {
            direccionURLFotoBackground: urlNuevaFotoBackground ?? "",
          },
        },
      );

      FotoBackgroundProcesada = result.modifiedCount !== 0;
    }

    console.log({ FotoPerfilProcesada, FotoBackgroundProcesada });
    return { FotoPerfilProcesada, FotoBackgroundProcesada };
  }

  private async ActualizaUsuario(
    archivoJSON: {
      titularUsuario: string;
      descripcionUsuario: string;
      linkLinkendin: string;
      linkGithub: string;
      linkPortafolioPersonal: string;
    },
    idUsuario: string,
  ) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(idUsuario) },
      {
        $set: {
          titularUsuario: archivoJSON.titularUsuario ?? undefined,
          descripcionUsuario: archivoJSON.descripcionUsuario ?? undefined,
          linksUsuario: {
            linkLinkendin: archivoJSON.linkLinkendin ?? "",
            linkGithub: archivoJSON.linkGithub ?? "",
            linkPortafolioPersonal: archivoJSON.linkPortafolioPersonal ?? "",
          },
        },
      },
    );

    return result.modifiedCount !== 0;
  }
}
