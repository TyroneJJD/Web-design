import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";
import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class IniciarSession {
  private gestorDatosUsuario: GestorDatosUsuario;
  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();
  }

  public async mostrarPaginaInicioDeSesion(context: Context) {
    const html = await renderizarVista(
      "login.html",
      {},
      directorioVistaSeccionActual + `/html_Login`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async manejadorInicioSesion(context: Context) {
    const credenciales = await this.obtenerDatosFormularioInicioDeSesion(
      context,
    );

    if (!credenciales) {
      context.response.status = 400;
      context.response.body = "Formato de cuerpo no soportado.";
      return;
    }

    const { email, password } = credenciales;

    if (email && password) {
      const userDataExists = await this.gestorDatosUsuario
        .obtenerUsuarioPorCredenciales(
          email,
          password,
        );

      if (userDataExists) {
        const key = await this.obtenerTokenAuth();
        const jwt = await create(
          { alg: "HS256", typ: "JWT" },
          {
            _id: userDataExists._id,
            nombreUsuario: userDataExists.nombreUsuario,
            apellidoUsuario: userDataExists.apellidoUsuario,
            correoElectronicoUsuario:
              userDataExists.correoElectronicoInstitucionalUsuario,

            esAdministrador: userDataExists.permisosUsuario.esAdministrador,
            esCoach: userDataExists.permisosUsuario.esCoach,
            puedePublicarEnElBlog:
              userDataExists.permisosUsuario.puedePublicarEnElBlog,
            puedePublicarProblemas:
              userDataExists.permisosUsuario.puedePublicarProblemas,
          },
          key,
        );

        context.cookies.set("auth_token", jwt, {
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 60 * 1000), // Tiempo en milisegundos (10 horas)
          secure: false,
        });

        //------------------------------------
        context.cookies.set(
          "toast",
          JSON.stringify({
            message: "Usuario creado exitosamente",
            type: "success",
          }),
          { httpOnly: false, path: "/" },
        );

        context.response.status = 303;
        context.response.headers.set("Location", "/home");
        return;
        //------------------------------------
      } else {
        context.response.status = 401;
        context.response.body = "Credenciales incorrectas";
        context.response.headers.set(
          "Location",
          `/login`,
        );
      }
    } else {
      context.response.status = 400;
      context.response.body = "Username and password must not be null.";
      context.response.headers.set(
        "Location",
        `/login`,
      );
    }
  }

  private async obtenerDatosFormularioInicioDeSesion(
    ctx: Context,
  ): Promise<{ email: string | null; password: string | null } | null> {
    const result = await ctx.request.body();

    if (result.type === "form") {
      const body = await result.value; // Obtiene el valor del cuerpo del formulario
      const email = body.get("email");
      const password = body.get("password");
      return { email, password };
    }

    return null; // Devuelve null si el formato no es soportado
  }

  private async obtenerTokenAuth() {
    const env = config();
    return await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.SECRET_JWT_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
  }
}
