import { ObjectId } from "npm:mongodb@6.1.0";

export interface IUsuario {
  _id?: ObjectId;

  nombreUsuario: string;
  correoElectronicoUsuario: string;
  contraseniaUsuario: string;
  fechaNacimientoUsuario: Date;

  universidadUsuario: string;
  carreraUniversitariaUsuario: string;

  esAdministrador: boolean;
  esCoach: boolean;
  puedePublicarEnElBlog: boolean;
  puedePublicarProblemas: boolean;

  agenda: ISesionEntrevista[];
}

export interface ISesionEntrevista {
  idReunion: string;
  horaInicio: Date;
  horaFin: Date;
  candidatosRegistrados: ICandidatosRegistrado[];
  candidatoSeleccionadoAEntrevistar: ICandidatosRegistrado;
  sesionAsignada: boolean;
}

export interface ICandidatosRegistrado {
  idCandidatoAEntrevistar: string;
  nombreCandidatoAEntrevistar: string;
  correoElectronicoCandidatoAEntrevistar: string;
}
