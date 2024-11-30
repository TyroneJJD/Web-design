import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import {
  IUsuario,
  ISesionEntrevista,
  ICandidatosRegistrado,
} from "../../DatosUsuario.ts";

export class ManejadorEntrevistador {
  private db: BaseDeDatosMongoDB;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;
  }

  private async obtenerCandidatosRegistradosALaSesion(
    idEntrevistador: string, 
    idReunion: string, 
  ): Promise<ICandidatosRegistrado[] | null> {
    try {
      // Buscar al usuario por ID
      const usuario = await  this.collection.findOne({ _id: new ObjectId(idEntrevistador) });
  
      if (!usuario) {
        throw new Error(`Usuario con ID ${idEntrevistador} no encontrado`);
      }
  
      // Buscar la sesión de entrevista por ID de la reunión en la agenda del usuario
      const sesion = usuario.agenda.find((sesion) => sesion.idReunion === idReunion);
  
      if (!sesion) {
        throw new Error(`Sesión de entrevista con ID ${idReunion} no encontrada`);
      }
  
      // Retornar los candidatos registrados de la sesión
      return sesion.candidatosRegistrados;
    } catch (error) {
      console.error("Error al obtener los candidatos de la sesión:", error);
      return null; // Si ocurre un error, retornamos null
    }
  }

  public async asignarCandidatoASesion(
    idSesion: string, // ID de la sesión a actualizar
    idCandidatoAAsignar: string, // ID del candidato a asignar
    collection: Collection<ISesionEntrevista> // Colección de sesiones en la base de datos
  ): Promise<ISesionEntrevista | null> {
    try {
      // Buscar la sesión de entrevista por su ID
      const sesion = await collection.findOne({ idReunion: idSesion });

      if (!sesion) {
        throw new Error(
          `Sesión de entrevista con ID ${idSesion} no encontrada`
        );
      }

      // Buscar al candidato en la lista de candidatos registrados
      const candidato = sesion.candidatosRegistrados.find(
        (candidato) => candidato.idCandidatoAEntrevistar === idCandidatoAAsignar
      );

      if (!candidato) {
        throw new Error(
          `Candidato con ID ${idCandidatoAAsignar} no registrado en la sesión`
        );
      }

      // Asignar al candidato como el seleccionado para entrevistar
      const updateResult = await collection.updateOne(
        { idReunion: idSesion },
        {
          $set: {
            candidatoSeleccionadoAEntrevistar: candidato,
            sesionAsignada: true,
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error(
          "Error al asignar el candidato a la sesión de entrevista."
        );
      }

      // Buscar la sesión actualizada y devolverla
      const updatedSesion = await collection.findOne({ idReunion: idSesion });

      if (!updatedSesion) {
        throw new Error(
          "Error al obtener la sesión de entrevista actualizada."
        );
      }

      return updatedSesion;
    } catch (error) {
      console.error("Error al asignar candidato a sesión:", error);
      return null;
    }
  }

  public async obtenerEntrevistadoPorId(id: string): Promise<IUsuario> {
    const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public agregarNuevosHorariosDeReunionDisponibles(
    dia: number,
    mes: number,
    anio: number,
    horaInicioDisponibilidad: number,
    minutoInicioDisponibilidad: number,
    horaFinDisponibilidad: number,
    minutoFinDisponibilidad: number,
    idEntrevistador: string
  ) {
    const entrevistasPosibles: ISesionEntrevista[] =
      this.obtenerSesionesPosiblesDeEntrevista(
        dia,
        mes,
        anio,
        horaInicioDisponibilidad,
        minutoInicioDisponibilidad,
        horaFinDisponibilidad,
        minutoFinDisponibilidad
      );
    entrevistasPosibles.forEach((entrevista) => {
      this.agregarEntrevistaALaAgenda(idEntrevistador, entrevista);
    });
  }

  private obtenerSesionesPosiblesDeEntrevista(
    dia: number,
    mes: number,
    anio: number,
    horaInicioDisponibilidad: number,
    minutoInicioDisponibilidad: number,
    horaFinDisponibilidad: number,
    minutoFinDisponibilidad: number
  ): ISesionEntrevista[] {
    const sesiones: ISesionEntrevista[] = [];

    const fechaInicio = new Date(
      anio,
      mes - 1,
      dia,
      horaInicioDisponibilidad,
      minutoInicioDisponibilidad
    );
    const fechaFin = new Date(
      anio,
      mes - 1,
      dia,
      horaFinDisponibilidad,
      minutoFinDisponibilidad
    );

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error("Fecha u hora inválida.");
    }
    if (fechaInicio >= fechaFin) {
      throw new Error(
        "La fecha de inicio debe ser anterior a la fecha de fin."
      );
    }

    let inicioEntrevista = new Date(fechaInicio);

    while (inicioEntrevista < fechaFin) {
      const duracionReunionEnMinutos = 30 * 60 * 1000;
      const finEntrevista = new Date(
        inicioEntrevista.getTime() + duracionReunionEnMinutos
      );

      if (finEntrevista > fechaFin) break;

      sesiones.push({
        idReunion: this.generarIdReunion(),
        horaInicio: new Date(inicioEntrevista),
        horaFin: new Date(finEntrevista),
        candidatosRegistrados: [],
        candidatoSeleccionadoAEntrevistar: {} as ICandidatosRegistrado,
        sesionAsignada: false,
      });

      const duracionToleranciaEnMinutos = 5 * 60 * 1000;
      inicioEntrevista = new Date(
        finEntrevista.getTime() + duracionToleranciaEnMinutos
      );
    }

    return sesiones;
  }

  private async agregarEntrevistaALaAgenda(
    idEntrevistador: string,
    entrevistaDisponible: ISesionEntrevista
  ): Promise<IUsuario | null> {
    try {
      const usuario = await this.collection.findOne({
        _id: new ObjectId(idEntrevistador),
      });

      if (!usuario) {
        throw new Error(`Usuario con ID ${idEntrevistador} no encontrado`);
      }

      const updateResult = await this.collection.updateOne(
        { _id: new ObjectId(idEntrevistador) },
        { $push: { agenda: entrevistaDisponible } }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error("Error al actualizar la agenda del usuario.");
      }

      const updatedUsuario = await this.collection.findOne({
        _id: new ObjectId(idEntrevistador),
      });

      if (!updatedUsuario) {
        throw new Error("Error al obtener el usuario actualizado.");
      }

      return updatedUsuario;
    } catch (error) {
      console.error("Error al agregar la entrevista:", error);
      return null;
    }
  }

  private generarIdReunion(): string {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return `${this.obtenerDosLetrasAleatorias(
      letras
    )}-${this.obtenerDosLetrasAleatorias(
      letras
    )}-${this.obtenerDosLetrasAleatorias(letras)}`;
  }

  private obtenerDosLetrasAleatorias(letras: string): string {
    return (
      letras.charAt(Math.floor(Math.random() * letras.length)) +
      letras.charAt(Math.floor(Math.random() * letras.length))
    );
  }
}
