import { ObjectId } from "npm:mongodb@6.1.0";

export interface IUsuario {
  _id?: ObjectId;

  nombreUsuario: string; // Reservado
  apellidoUsuario: string; // Reservado
  correoElectronicoUsuario: string; // Reservado
  contraseniaUsuario: string; // Reservado


  esAdministrador: boolean; // Reservado
  esCoach: boolean; // Reservado
  puedePublicarEnElBlog: boolean; // Reservado
  puedePublicarProblemas: boolean; // Reservado

  agenda: ISesionEntrevista[]; // Reservado
  bandejaDeEntrada: IMensajesusuario[]; // Reservado
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

export interface IMensajesusuario {
  idUsuarioEmisor: string;
  contenidoMensaje: string;
  fechaEnvio: Date;
}
