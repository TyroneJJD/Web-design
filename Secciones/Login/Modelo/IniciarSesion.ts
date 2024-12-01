import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class IniciarSession {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
  }

  public async mostrarPaginaInicioDeSesion(context: Context) {
    const html = await renderizarVista(
      "login.html",
      {},
      directorioVistaSeccionActual + `/html_Login`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async obtenerUsuarioPorId(id: string): Promise<IUsuario> {
    const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public async obtenerUsuarioPorCredenciales(
    correoElectronico: string,
    contrasenia: string
  ): Promise<IUsuario | null> {
    try {
      const usuario = await this.collection.findOne({
        correoElectronicoUsuario: correoElectronico,
        contraseniaUsuario: contrasenia,
      });

      if (!usuario) {
        throw new Error("Correo electrónico o contraseña incorrectos.");
      }

      return usuario;
    } catch (_error) {
      // El usuario no existe
      return null;
    }
  }

  public async manejadorInicioSesion(context: Context) {
    const credenciales = await this.obtenerDatosFormularioInicioDeSesion(
      context
    );

    if (!credenciales) {
      context.response.status = 400;
      context.response.body = "Formato de cuerpo no soportado.";
      return;
    }

    const { email, password } = credenciales;

    if (email && password) {
      const userDataExists = await this.obtenerUsuarioPorCredenciales(
        email,
        password
      );

      if (userDataExists) {
        const key = await this.obtenerTokenAuth();
        const jwt = await create(
          { alg: "HS256", typ: "JWT" },
          {
            _id: userDataExists._id,
            nombreUsuario: userDataExists.nombreUsuario,
            correoElectronicoUsuario: userDataExists.correoElectronicoUsuario,

            esAdministrador: userDataExists.esAdministrador,
            esCoach: userDataExists.esCoach,
            puedePublicarEnElBlog: userDataExists.puedePublicarEnElBlog,
            puedePublicarProblemas: userDataExists.puedePublicarProblemas,

            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          key
        );

        context.cookies.set("auth_token", jwt, {
          httpOnly: true,
          secure: false,
        });
        context.response.redirect("/protected");
      } else {
        context.response.status = 401;
        context.response.body = "Credenciales incorrectas";
        context.response.redirect("/login");
      }
    } else {
      context.response.status = 400;
      context.response.body = "Username and password must not be null.";
      context.response.redirect("/login");
    }
  }

  private async obtenerDatosFormularioInicioDeSesion(
    ctx: Context
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
      ["sign", "verify"]
    );
  }
}
