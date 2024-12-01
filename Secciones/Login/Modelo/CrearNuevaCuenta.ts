import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class crearNuevaCuenta {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
  }

  public async crearNuevoUsuario(
    usuario: Omit<IUsuario, "_id">
  ): Promise<IUsuario> {
    // Por seguridad todo usuario nuevo inicia con permisos desactivados
    usuario.esAdministrador = false;
    usuario.esCoach = false;
    usuario.puedePublicarEnElBlog = false;
    usuario.puedePublicarProblemas = false;

    const result = await this.collection.insertOne(usuario);
    return { _id: result, ...usuario };
  }

  public async mostrarPaginaFormularioRegistro(context: Context) {
    const html = await renderizarVista(
      "formulario_registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async mostrarPaginaRegistro(context: Context) {
    const html = await renderizarVista(
      "registro.html",
      {},
      directorioVistaSeccionActual + `/html_Login`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async manejadorCreacionUsuario(context: Context) {
    // Obtener el parámetro 'tipo' de la URL
    const url = new URL(context.request.url);
    const tipo = url.searchParams.get("tipo"); // Ejemplo: 'trainee' o 'coach'

    // Validar el parámetro 'tipo'
    if (tipo !== "coach" && tipo !== "trainee") {
      context.response.status = 400;
      context.response.body = {
        message: "El parámetro 'tipo' es inválido.",
      };
      return;
    }

    // Verificar si la solicitud es de tipo POST (envío de formulario)
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      // Obtener los datos del formulario
      const nombre = body.get("nombre") || "";
      const apellido = body.get("apellido") || "";
      const correo = body.get("correo") || "";
      const contrasena = body.get("contrasena") || "";

      // Realizar validaciones, si es necesario
      if (!nombre || !apellido || !correo || !contrasena) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        return;
      }

      console.log(nombre, apellido, correo, contrasena, tipo);

      // Aquí puedes agregar la lógica para guardar los datos en una base de datos
      // Ejemplo: crear un nuevo usuario en la base de datos (se omite la implementación de la DB)
      // const usuarioCreado = await crearUsuarioEnBaseDeDatos(nombre, apellido, correo, contrasena, tipo);

      // Si se crea correctamente, redirigimos al usuario a '/home'
      context.response.status = 303; // 303 See Other (redirección)
      context.response.headers.set("Location", "/home");
      return;
    }
  }
}
