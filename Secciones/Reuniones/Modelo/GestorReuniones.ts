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

  public async mostrarReservacionEntrenador(context: Context) {
    

    const html = await renderizarVista(
      "ReservacionEntrenador.html",
      {},
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async mostrarCalendarioEntrevistador(context: Context) {
    

    const html = await renderizarVista(
      "CalendarioEntrevistador.html",
      {},
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async generarReuniones(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;
  
      const idCoach = body.get("idCoach")?.trim() || "";
      const fechaReunionStr = body.get("fechaReunion")?.trim() || "";
      const horaInicioStr = body.get("horaInicio")?.trim() || "";
      const horaFinStr = body.get("horaFin")?.trim() || "";
  
      if (!idCoach || !fechaReunionStr || !horaInicioStr || !horaFinStr) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        return;
      }
  
      try {
        // Convertir la fecha de la reunión
        const [anio, mes, dia] = fechaReunionStr.split("-").map(Number);
  
        // Crear objetos `Date` para horaInicio y horaFin usando la fecha proporcionada
        const [horaInicio, minutosInicio] = horaInicioStr.split(":").map(Number);
        const [horaFin, minutosFin] = horaFinStr.split(":").map(Number);
  
        const horaInicioDate = new Date(anio, mes - 1, dia, horaInicio, minutosInicio);
        const horaFinDate = new Date(anio, mes - 1, dia, horaFin, minutosFin);
  
        // Validar que la hora de inicio sea menor que la hora de fin
        if (horaInicioDate >= horaFinDate) {
          context.response.status = 400;
          context.response.body = {
            message: "La hora de inicio debe ser antes de la hora de fin.",
          };
          return;
        }
  
        // Crear el objeto `nuevoUsuario`
        const nuevoUsuario: Omit<ISesionEntrevista, "_id"> = {
          idCoach,
          horaInicio: horaInicioDate,
          horaFin: horaFinDate,
          candidatosRegistrados: [],
          candidatoSeleccionadoAEntrevistar: {} as IDetallesCandidatosRegistrado,
          sesionAsignada: false,
        };
  
        // Guardar el nuevo usuario en la base de datos
        await this.crearNuevoUsuario(nuevoUsuario);
  
        // Redirigir con un mensaje de éxito
        context.response.status = 303;
        context.response.headers.set(
          "Location",
          `/login?toast=Usuario creado exitosamente&type=success`
        );
      } catch (error) {
        console.error("Error procesando los datos:", error);
        context.response.status = 500;
        context.response.body = { message: "Error interno del servidor." };
      }
    } else {
      context.response.status = 400;
      context.response.body = { message: "No se enviaron datos en el formulario." };
    }
  }

  public async inscribirmeASesion(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;
  
      // Recuperar los datos del formulario
      const idSesion = body.get("idSesion")?.trim() || "";
      const idCandidatoRegistrado = body.get("idCandidatoRegistrado")?.trim() || "";
      const nombreCandidato = body.get("nombreCandidato")?.trim() || "";
      const tipoDeReunion = body.get("tipoDeReunion")?.trim() || "";
      const motivoDeLaReunion = body.get("motivoDeLaReunion")?.trim() || "";
      const comentariosAdicionales = body.get("comentariosAdicionales")?.trim() || "";
      const linkResume = body.get("linkResume")?.trim() || "";
  
      if (
        !idSesion ||
        !idCandidatoRegistrado ||
        !nombreCandidato ||
        !tipoDeReunion ||
        !motivoDeLaReunion ||
        !linkResume
      ) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        return;
      }
  
      try {
        // Crear el objeto candidato
        const nuevoCandidato: IDetallesCandidatosRegistrado = {
          idCandidatoRegistrado,
          nombreCandidato,
          tipoDeReuinion: tipoDeReunion,
          motivoDeLaReunion,
          comentariosAdicionales,
          linkResume,
          estadoReunion: "pendiente", // Estado inicial
          respuestaDelEntrevistador: "",
        };
  
        // Buscar la sesión en la base de datos
        const sesion = await this.obtenerIdReunion(idSesion);
        if (!sesion) {
          context.response.status = 404;
          context.response.body = { message: "Sesión no encontrada." };
          return;
        }
  
        // Agregar el candidato a la lista de la sesión
        sesion.candidatosRegistrados.push(nuevoCandidato);
  
        // Actualizar la sesión en la base de datos
        await this.agregarCandidatoAReunion(idSesion, sesion);
  
        // Responder con éxito
        context.response.status = 200;
        context.response.body = { message: "Candidato agregado exitosamente." };
      } catch (error) {
        console.error("Error agregando el candidato:", error);
        context.response.status = 500;
        context.response.body = { message: "Error interno del servidor." };
      }
    } else {
      context.response.status = 400;
      context.response.body = { message: "No se enviaron datos en el formulario." };
    }
  }

  private async obtenerIdReunion(idSesion: string): Promise<ISesionEntrevista | null> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
    const sesion = await collection.findOne({ _id: { $oid: idSesion } });
    return sesion as ISesionEntrevista | null;
  }

  private async agregarCandidatoAReunion(idSesion: string, sesion: ISesionEntrevista): Promise<void> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
    await collection.updateOne(
      { _id: { $oid: idSesion } },
      { $set: { candidatosRegistrados: sesion.candidatosRegistrados } }
    );
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
