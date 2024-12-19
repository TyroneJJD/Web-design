import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";
import { GestorEntrevista } from "../../../Servicios/BaseDeDatos/GestorEntrevista.ts";
import {
  IDetallesCandidatosRegistrado,
} from "../../../Servicios/BaseDeDatos/Entrevistas.ts";
import {
  obtenerApellidoUsuario,
  obtenerIdUsuario,
  obtenerNombresUsuario,
} from "../../../Servicios/GestorPermisos.ts";

// <!!!!!----------!!!!!> ZONA DE GUERRA

export class ReservacionEntrenador {
  private gestorDatosUsuario: GestorDatosUsuario;
  private gestorEntrevista: GestorEntrevista;

  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();
    this.gestorEntrevista = new GestorEntrevista();

    this.mostrarReservacionEntrenador = this.mostrarReservacionEntrenador.bind(
      this,
    );
    this.inscribirmeASesion = this.inscribirmeASesion.bind(this);
  }

  public async mostrarReservacionEntrenador(context: Context) {
    const idMiUsuario = await obtenerIdUsuario(context);
    const nombreUsuario = await obtenerNombresUsuario(context);
    const apellidoUsuario = await obtenerApellidoUsuario(context);
    const IdSolicitado = this.obtenerIdSolicitado(context);
    const InfoDelCoach = await this.gestorDatosUsuario
      .obtenerEntrevistadorPorId(IdSolicitado);
    const reunionesDelCoach = await this.gestorEntrevista
      .obtenerReunionesCreadasPorElEntrenador(
        IdSolicitado,
      );
    const nombresCandidato = nombreUsuario + " " + apellidoUsuario;

    const html = await renderizarVista(
      "ReservacionEntrenador.html",
      {
        idUsuario: idMiUsuario,
        nombreCandidato: nombresCandidato,
        reuniones: reunionesDelCoach,
        coachInfo: InfoDelCoach,
      },
      directorioVistaSeccionActual + `/html_Reuniones`,
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async inscribirmeASesion(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      // Recuperar los datos del
      const idEntrevistador = body.get("idCoach")?.trim() || "";
      const idSesionReunion = body.get("idSesion")?.trim() || "";
      const idCandidatoRegistrado = body.get("idCandidatoRegistrado")?.trim() ||
        "";
      const nombreCandidato = body.get("nombreCandidato")?.trim() || "";
      const tipoDeReunion = body.get("tipoDeReunion")?.trim() || "";
      const motivoDeLaReunion = body.get("motivoDeLaReunion")?.trim() || "";
      const comentariosAdicionales =
        body.get("comentariosAdicionales")?.trim() || "";
      const linkResume = body.get("linkResume")?.trim() || "";

      console.log(
        idSesionReunion,
        idCandidatoRegistrado,
        tipoDeReunion,
        motivoDeLaReunion,
        comentariosAdicionales,
        linkResume,
      );

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
          nombreCandidato: nombreCandidato,
          tipoDeReuinion: tipoDeReunion,
          motivoDeLaReunion: motivoDeLaReunion,
          comentariosAdicionales: comentariosAdicionales,
          linkResume: linkResume,
          estadoReunion: "pendiente", // Estado inicial
          respuestaDelEntrevistador: "",
        };

        // Buscar la sesión en la base de datos
        const registroReunion = await this.gestorEntrevista
          .obtenerTodosLosDatosDeLaReunionPorIDV2(
            idSesionReunion,
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
        await this.gestorEntrevista.agregarCandidatoAReunion(
          idSesionReunion,
          registroReunion,
        );

        // Responder con éxito
        context.response.status = 200;
        context.response.body = { message: "Candidato agregado exitosamente." };
        context.response.redirect(
          "/reservacionEntrenador?perfil=" + idEntrevistador,
        );
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

  private obtenerIdSolicitado(context: Context): string {
    const url = context.request.url;
    const params = url.searchParams;
    const idPerfil = params.get("perfil") ?? "";
    return idPerfil;
  }
}
