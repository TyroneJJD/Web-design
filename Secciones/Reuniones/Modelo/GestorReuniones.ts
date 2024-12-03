import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { ObjectId } from "npm:mongodb";
import {
  ISesionEntrevista,
  IDetallesCandidatosRegistrado,
} from "../../Reuniones.ts";

export class GestorReuniones {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.obtenerRegistroreunionPorId =
      this.obtenerRegistroreunionPorId.bind(this);
    this.obtenerUsuarioPorId = this.obtenerUsuarioPorId.bind(this);
    this.obtenerReunionesPorCandidato =
      this.obtenerReunionesPorCandidato.bind(this);
    this.mostrarCalendarioTrainee = this.mostrarCalendarioTrainee.bind(this);
    this.insertarNuevaReunion = this.insertarNuevaReunion.bind(this);
    this.generarReuniones = this.generarReuniones.bind(this);
    this.agregarCandidatoAReunion = this.agregarCandidatoAReunion.bind(this);
    this.mostrarReservacionEntrenador =
      this.mostrarReservacionEntrenador.bind(this);
    this.mostrarCalendarioEntrevistador =
      this.mostrarCalendarioEntrevistador.bind(this);
    this.generarReuniones = this.generarReuniones.bind(this);
    this.inscribirmeASesion = this.inscribirmeASesion.bind(this);
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
    /*const IDusuario = "674cce539dca6ab3034178fa";

    if (!IDusuario) {
      throw new Error("ID de usuario no encontrado");
    }
    const datosUsuario = await this.obtenerUsuarioPorId(IDusuario);
    const reuniones = await this.obtenerReunionesPorCandidato(IDusuario);
    console.log(reuniones);
*/
    const html = await renderizarVista(
      "CalendarioTrainee.html",
      {},
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

      const idCoach = "xxxxxxxxxx";
      const fechaReunionStr = body.get("fechaReunion")?.trim() || "";
      const horaInicioStr = body.get("horaInicio")?.trim() || "";
      const horaFinStr = body.get("horaFin")?.trim() || "";
      console.log(fechaReunionStr);
      console.log(horaInicioStr);
      console.log(horaFinStr);
      console.log("-----------");

      if (!idCoach || !fechaReunionStr || !horaInicioStr || !horaFinStr) {
        context.response.status = 400;
        context.response.body = { message: "Todos los campos son requeridos." };
        return;
      }

      try {
        // Convertir la fecha de la reunión
        const [anio, mes, dia] = fechaReunionStr.split("-").map(Number);

        // Crear objetos `Date` para horaInicio y horaFin usando la fecha proporcionada
        const [horaInicio, minutosInicio] = horaInicioStr
          .split(":")
          .map(Number);
        const [horaFin, minutosFin] = horaFinStr.split(":").map(Number);

        const horaInicioDate = new Date(
          anio,
          mes - 1,
          dia,
          horaInicio,
          minutosInicio
        );
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
          idCoach: idCoach,
          horaInicio: horaInicioDate,
          horaFin: horaFinDate,
          candidatosRegistrados: [],
          candidatoSeleccionadoAEntrevistar:
            {} as IDetallesCandidatosRegistrado,
          sesionAsignada: false,
        };

        // Guardar el nuevo usuario en la base de datos
        await this.insertarNuevaReunion(nuevoUsuario);

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
      context.response.body = {
        message: "No se enviaron datos en el formulario.",
      };
    }
  }

  public async inscribirmeASesion(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      // Recuperar los datos del formulario
      const idSesionReunion = "674e9623334586762d8bcc10"; //body.get("idSesion")?.trim() || "";
      const idCandidatoRegistrado = "hgbf"; //body.get("idCandidatoRegistrado")?.trim() || "";


      const tipoDeReunion = body.get("tipoDeReunion")?.trim() || "";
      const motivoDeLaReunion = body.get("motivoDeLaReunion")?.trim() || "";
      const comentariosAdicionales =
        body.get("comentariosAdicionales")?.trim() || "";
      const linkResume = body.get("linkResume")?.trim() || "";

      if (
        !idSesionReunion ||
        !idCandidatoRegistrado ||

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
          idCandidatoRegistrado: idCandidatoRegistrado,

          tipoDeReuinion: tipoDeReunion,
          motivoDeLaReunion: motivoDeLaReunion,
          comentariosAdicionales: comentariosAdicionales,
          linkResume: linkResume,
          estadoReunion: "pendiente", // Estado inicial
          respuestaDelEntrevistador: "",
        };

        // Buscar la sesión en la base de datos
        const registroReunion = await this.obtenerRegistroreunionPorId(
          idSesionReunion
        );
        console.log(registroReunion);
        if (!registroReunion) {
          context.response.status = 404;
          context.response.body = { message: "Sesión no encontrada." };
          return;
        }

        // Agregar el candidato a la lista de la sesión
        registroReunion.candidatosRegistrados.push(nuevoCandidato);

        // Actualizar la sesión en la base de datos
        await this.agregarCandidatoAReunion(idSesionReunion, registroReunion);

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
      context.response.body = {
        message: "No se enviaron datos en el formulario.",
      };
    }
  }

  public async obtenerRegistroreunionPorId(
    idSesion: string
  ): Promise<ISesionEntrevista> {
    const collection =
      (await this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
        "Reuniones"
      )) as unknown as Collection<ISesionEntrevista>;
    const dato = await collection.findOne({ _id: new ObjectId(idSesion) });
    console.log(dato);
    if (!dato) {
      throw new Error(`Sesión con ID ${idSesion} no encontrada`);
    }
    return dato;
  }

  private async agregarCandidatoAReunion(
    idSesion: string,
    sesion: ISesionEntrevista
  ): Promise<void> {
    // Obtener la colección con el tipo definido
    const collection =
      this.db.obtenerReferenciaColeccion<ISesionEntrevista>("Reuniones");

    try {
      // Convertir idSesion a ObjectId si es necesario

      // Actualizar el registro en la base de datos
      const resultado = await collection.updateOne(
        { _id: new ObjectId(idSesion) }, // Usar el ObjectId en el filtro
        { $set: { candidatosRegistrados: sesion.candidatosRegistrados } } // Actualizar el campo
      );

      // Verificar si se actualizó el documento
      if (resultado.matchedCount === 0) {
        throw new Error(`No se encontró una sesión con _id: ${idSesion}.`);
      }

      console.log(`Se actualizó correctamente la sesión con _id: ${idSesion}.`);
    } catch (error) {
      console.error("Error agregando el candidato:", error);
      throw new Error("No se pudo agregar el candidato a la reunión.");
    }
  }

  public async insertarNuevaReunion(
    nuevaReunion: Omit<ISesionEntrevista, "_id">
  ): Promise<ISesionEntrevista> {
    console.log("Creando nuevo usuario:", nuevaReunion);
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
    const result = await collection.insertOne(nuevaReunion);
    return { _id: result.toString(), ...nuevaReunion };
  }
}
