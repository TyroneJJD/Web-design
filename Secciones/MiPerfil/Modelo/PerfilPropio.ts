import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { ObjectId } from "npm:bson@^6.0";
import { obtenerIdUsuario } from "../../../Servicios/Autenticacion.ts";

export class PerfilPropio {
  private collection: Collection<IUsuario>;
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;

    this.obtenerUsuarioPorId = this.obtenerUsuarioPorId.bind(this);
    this.mostrarPaginaEditarMiPerfil =
      this.mostrarPaginaEditarMiPerfil.bind(this);
    this.editarDatosPerfil = this.editarDatosPerfil.bind(this);
  }

  public async mostrarPaginaVerMiPerfil(context: Context) {}

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
      directorioVistaSeccionActual + `/html_MiPerfil`
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

      const body = context.request.body({ type: "form" });
      const formData = await body.value;

      const titularUsuario = formData.get("rol");
      const descripcionUsuario = formData.get("sobre_mi");
      const linkLinkendin = formData.get("linkLinkedin");
      const linkGithub = formData.get("linkGithub");
      const linkPortafolioPersonal = formData.get("linkPortafolio");

      // Asumimos que el ID del usuario está en los headers o cookies
      const idUsuario = await obtenerIdUsuario(context);

      if (!idUsuario) {
        context.response.status = 400;
        context.response.body = { error: "ID de usuario no proporcionado" };
        return;
      }

      const result = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        {
          $set: {
            titularUsuario: titularUsuario ?? undefined,
            descripcionUsuario: descripcionUsuario ?? undefined,
            linksUsuario: {
              linkLinkendin: linkLinkendin ?? "",
              linkGithub: linkGithub ?? "",
              linkPortafolioPersonal: linkPortafolioPersonal ?? "",
            },
          },
        }
      );

      if (result.modifiedCount === 0) {
        context.response.status = 404;
        context.response.body = {
          error: "Usuario no encontrado o no modificado",
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

  public async editarImagenDePerfil(context: Context) {}
  public async editarBackgroundDePerfil(context: Context) {}
}
