
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";

export class crearNuevaCuenta {
  private gestorDatosUsuario: GestorDatosUsuario;

  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();
  }

 

  public async mostrarPaginaFormularioRegistro(context: Context) {
    const html = await renderizarVista(
      "formulario_registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async mostrarPaginaRegistro(context: Context) {
    const html = await renderizarVista(
      "registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  // <!----------> La ontencion de datos del formulario deberia ser una funcion aparte
  public async manejadorCreacionUsuario(context: Context) {
    const url = new URL(context.request.url);
    const tipo = url.searchParams.get("tipo");

    if (tipo !== "coach" && tipo !== "trainee") {
      context.response.status = 400;
      context.response.body = {
        message: "El parámetro 'tipo' es inválido.",
      };
      context.response.headers.set("Location", "/login");
    }
    const quiereSerCoach = tipo === "coach";

    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      const nombre = body.get("nombre") || "";
      const apellido = body.get("apellido") || "";
      const correo = body.get("correo") || "";
      const contrasena = body.get("contrasena") || "";

      if (!nombre || !apellido || !correo || !contrasena) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        context.response.headers.set("Location", "/login");
      }

      const nuevoUsuario: Omit<IUsuario, "_id"> = {
        nombreUsuario: nombre,
        correoElectronicoInstitucionalUsuario: correo,
        apellidoUsuario: apellido,
        contraseniaUsuario: contrasena,
        datosPersonalesUsuario: {
          correoElectronicoGmailUsuario: "",
          titularUsuario: "",
          descripcionUsuario: "",
          direccionURLFotoPerfil: "",
          direccionURLFotoBackground: "",
          linksUsuario: {
            linkLinkendin: "",
            linkGithub: "",
            linkPortafolioPersonal: "",
          },
        },

        reseniasUsuario: [],
        permisosUsuario: {
          quiereSerCoach: quiereSerCoach,
          esAdministrador: false,
          esCoach: false,
          puedePublicarEnElBlog: false,
          puedePublicarProblemas: false,
        },
      };
      this.gestorDatosUsuario.crearNuevoUsuario(nuevoUsuario);
      context.response.status = 303;
      context.response.status = 303;
      context.response.headers.set(
        "Location",
        `/login?toast=Usuario creado exitosamente&type=success`,
      );
      return;
    }
  }
}
