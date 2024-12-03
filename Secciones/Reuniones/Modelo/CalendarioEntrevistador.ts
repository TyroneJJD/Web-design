import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import {
  ISesionEntrevista,
  IDetallesCandidatosRegistrado,
} from "../../Reuniones.ts";

export class CalendarioEntrevistador {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();

    this.insertarNuevaReunion = this.insertarNuevaReunion.bind(this);
    this.generarReuniones = this.generarReuniones.bind(this);

    this.mostrarCalendarioEntrevistador =
      this.mostrarCalendarioEntrevistador.bind(this);
    this.generarReuniones = this.generarReuniones.bind(this);
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
        context.response.headers.set("Location", `/login`);
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
