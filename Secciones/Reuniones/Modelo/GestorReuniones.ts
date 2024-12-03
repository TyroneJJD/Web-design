import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { ObjectId } from "npm:bson@6";
import { ISesionEntrevista, IDetallesCandidatosRegistrado } from "../../Reuniones.ts";

export class GestorReuniones {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.obtenerUsuarioPorId = this.obtenerUsuarioPorId.bind(this);
    this.obtenerReunionesPorCandidato =
      this.obtenerReunionesPorCandidato.bind(this);
    this.mostrarCalendarioTrainee = this.mostrarCalendarioTrainee.bind(this);
  }

  public async obtenerUsuarioPorId(id: string): Promise<IUsuario> {
    const collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;

    const usuario = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public async obtenerReunionesPorCandidato(
    id: string
  ): Promise<ISesionEntrevista[]> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;

    const reuniones = await collection
      .find({ "candidatosRegistrados.idCandidatoRegistrado": id })
      .toArray();

    if (reuniones.length === 0) {
      throw new Error(`No se encontraron reuniones con el candidato ID ${id}`);
    }

    return reuniones;
  }

  public async mostrarCalendarioTrainee(context: Context) {
    //const IDusuario = await obtenerIdUsuario(context);
    const IDusuario = "674cce539dca6ab3034178fa";

    if (!IDusuario) {
      throw new Error("ID de usuario no encontrado");
    }
    const datosUsuario = await this.obtenerUsuarioPorId(IDusuario);
    const reuniones = await this.obtenerReunionesPorCandidato(IDusuario);
    console.log(reuniones);

    const html = await renderizarVista(
      "CalendarioTrainee.html",
      { datosUsuario },
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async generarReuniones(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      const idCoach = body.get("idCoach") || "";
      const horaInicio = body.get("horaInicio") || "";
      const horaFin = body.get("horaFin") || "";

      if (!idCoach || !horaInicio || !horaFin) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        context.response.headers.set("Location", "/login");
      }

      const nuevoUsuario: Omit<ISesionEntrevista, "_id"> = {
        idCoach: "string",
        horaInicio: new Date(),
        horaFin: new Date(),
        candidatosRegistrados: [],
        candidatoSeleccionadoAEntrevistar: {} as IDetallesCandidatosRegistrado,
        sesionAsignada: false,
      };
      this.crearNuevoUsuario(nuevoUsuario);
      context.response.status = 303;
      context.response.status = 303;
      context.response.headers.set(
        "Location",
        `/login?toast=Usuario creado exitosamente&type=success`
      );
      return;
    }
  }

  public async crearNuevoUsuario(
    usuario: Omit<ISesionEntrevista, "_id">
  ): Promise<ISesionEntrevista> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
    const result = await collection.insertOne(usuario);
    return { _id: result.toString(), ...usuario };
  }
}
