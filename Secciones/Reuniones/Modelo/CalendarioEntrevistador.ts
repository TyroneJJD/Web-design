import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";
import { GestorEntrevista } from "../../../Servicios/BaseDeDatos/GestorEntrevista.ts";
import {
  IDetallesCandidatosRegistrado,
  ISesionEntrevista,
} from "../../../Servicios/BaseDeDatos/Entrevistas.ts";
import { obtenerIdUsuario } from "../../../Servicios/GestorPermisos.ts";

// <!!!!!----------!!!!!> ZONA DE GUERRA

export class CalendarioEntrevistador {
  private gestorDatosUsuario: GestorDatosUsuario;
  private gestorEntrevista: GestorEntrevista;
  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();
    this.gestorEntrevista = new GestorEntrevista();

    this.generarReuniones = this.generarReuniones.bind(this);

    this.mostrarCalendarioEntrevistador = this.mostrarCalendarioEntrevistador
      .bind(this);
    this.generarReuniones = this.generarReuniones.bind(this);

    this.asignarCandidatoAReunion = this.asignarCandidatoAReunion.bind(this);
  }

  public async asignarCandidatoAReunion(context: Context) {
    try {
      const body = context.request.body({ type: "json" });
      const { candidato, idReunion } = await body.value;

      if (!candidato || !idReunion) {
        context.response.status = 400;
        context.response.body = {
          error: "Candidato o ID de reunión faltante.",
        };
        return;
      }

      const registroReunion = await this.gestorEntrevista
        .obtenerTodosLosDatosDeLaReunionPorID(
          idReunion,
        );

      // Mover el candidato a candidatoSeleccionadoAEntrevistar
      const [candidatoSeleccionado] = registroReunion.candidatosRegistrados
        .splice(candidato, 1);
      registroReunion.candidatoSeleccionadoAEntrevistar = candidatoSeleccionado;

      // Marcar la sesión como asignada
      registroReunion.sesionAsignada = true;
      registroReunion.candidatoSeleccionadoAEntrevistar.estadoReunion =
        "aceptado";
      registroReunion.candidatoSeleccionadoAEntrevistar
        .respuestaDelEntrevistador = "Por favor checa tu correo electrónico.";

      // Actualizar el estado y la respuesta de los candidatos no seleccionados
      registroReunion.candidatosRegistrados.forEach((candidato) => {
        candidato.estadoReunion = "rechazado";
        candidato.respuestaDelEntrevistador =
          "Otro candidato fue seleccionado, mil disculpas.";
      });

      await this.gestorEntrevista.actualizarReunion(registroReunion);

      context.response.status = 200;
      context.response.body = {
        message: "Candidato asignado a la reunión con éxito.",
        candidato,
        idReunion,
      };
    } catch (error) {
      // Manejo de errores
      console.error("Error al asignar candidato a reunión:", error);
      context.response.status = 500;
      context.response.body = { error: "Ocurrió un error en el servidor." };
    }
  }

  public async mostrarCalendarioEntrevistador(context: Context) {
    const IDusuarioSacadoDeLasCookies = await obtenerIdUsuario(context);
    if (!IDusuarioSacadoDeLasCookies) {
      context.response.status = 400;
      context.response.body = { message: "Usuario no autenticado." };
      return;
    }
    const datosDelEntrevistadorActual = await this.gestorDatosUsuario
      .obtenerEntrevistadorPorId(
        IDusuarioSacadoDeLasCookies,
      );
    const reunionesQuePropusoElEntrevistador = await this.gestorEntrevista
      .obtenerReunionesCreadasPorElEntrevistador(
        IDusuarioSacadoDeLasCookies,
      );

    const html = await renderizarVista(
      "CalendarioEntrevistador.html",
      {
        datosUsuario: datosDelEntrevistadorActual,
        reuniones: reunionesQuePropusoElEntrevistador,
      },
      directorioVistaSeccionActual + `/html_Reuniones`,
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async generarReuniones(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      const idCoach = await obtenerIdUsuario(context);
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
        const [horaInicio, minutosInicio] = horaInicioStr
          .split(":")
          .map(Number);
        const [horaFin, minutosFin] = horaFinStr.split(":").map(Number);

        const horaInicioDate = new Date(
          anio,
          mes - 1,
          dia,
          horaInicio,
          minutosInicio,
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
        await this.gestorEntrevista.insertarNuevaReunion(nuevoUsuario);

        // Redirigir con un mensaje de éxito
        context.response.status = 303;
        context.response.headers.set("Location", `/calendarioEntrevistador`);
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
}
