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
import { 
  obtenerIdUsuario,
  obtenerNombresUsuario,
  obtenerApellidoUsuario
} from "../../../Servicios/Autenticacion.ts";

export class ReservacionEntrenador {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.obtenerTodosLosDatosDeLaReunionPorID =
      this.obtenerTodosLosDatosDeLaReunionPorID.bind(this);
    this.agregarCandidatoAReunion = this.agregarCandidatoAReunion.bind(this);
    this.mostrarReservacionEntrenador =
      this.mostrarReservacionEntrenador.bind(this);
    this.inscribirmeASesion = this.inscribirmeASesion.bind(this);
  }

  public async mostrarReservacionEntrenador(context: Context) {
    const idMiUsuario = await obtenerIdUsuario(context);
    const nombreUsuario = await obtenerNombresUsuario(context);
    const apellidoUsuario = await obtenerApellidoUsuario(context);
    const IdSolicitado = this.obtenerIdSolicitado(context);
    const InfoDelCoach = await this.obtenerEntrevistadorPorId(IdSolicitado);
    const reunionesDelCoach = await this.obtenerReunionesCreadasPorElEntrenador(IdSolicitado);
    const nombresCandidato = nombreUsuario + " " + apellidoUsuario;

    const html = await renderizarVista(
      "ReservacionEntrenador.html",
      {
        idUsuario: idMiUsuario,
        nombreCandidato: nombresCandidato,
        reuniones: reunionesDelCoach,
        coachInfo:InfoDelCoach
      },
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async inscribirmeASesion(context: Context) {
    if (context.request.hasBody) {
      const body = await context.request.body({ type: "form" }).value;

      // Recuperar los datos del 
      const idEntrevistador = body.get("idCoach")?.trim() || "";
      const idSesionReunion = body.get("idSesion")?.trim() || "";
      const idCandidatoRegistrado = body.get("idCandidatoRegistrado")?.trim() || "";
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
        linkResume
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
        const registroReunion = await this.obtenerTodosLosDatosDeLaReunionPorID(
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
        context.response.redirect("/reservacionEntrenador?perfil="+idEntrevistador);
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

  public async obtenerTodosLosDatosDeLaReunionPorID(
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

  private async obtenerEntrevistadorPorId(id: string): Promise<IUsuario> {
    const collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;

    const usuario = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  private obtenerIdSolicitado(context:Context):string {
    const url = context.request.url; 
    const params = url.searchParams; 
    const idPerfil = params.get("perfil")?? "";
    return idPerfil;
  }

  private async obtenerReunionesCreadasPorElEntrenador(
    idEntrevistador: string
  ): Promise<ISesionEntrevista[]> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;

    return await collection
      .find({ idCoach: idEntrevistador })
      .sort({ horaInicio: 1 }) // 1 para ascendente, -1 para descendente
      .toArray();
  }
}
