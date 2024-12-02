import { ObjectId } from "npm:mongodb@6.1.0";

export interface IUsuario {
  _id?: ObjectId;

  nombreUsuario: string; // Reservado
  apellidoUsuario: string; // Reservado
  correoElectronicoUsuario: string; // Reservado
  contraseniaUsuario: string; // Reservado

  titularUsuario: string; // Reservado
  descripcionUsuario: string; // Reservado
  linksUsuario: ILinksUsuario; // Reservado
  reseniasUsuario: IReseniasUsuario[]; // Reservado

  quiereSerCoach: boolean; // Reservado
  esAdministrador: boolean; // Reservado
  esCoach: boolean; // Reservado
  puedePublicarEnElBlog: boolean; // Reservado
  puedePublicarProblemas: boolean; // Reservado

  direccionURLFotoPerfil: string; // Reservado
  direccionURLFotoBackground: string; // Reservado
}

export interface IMensajesusuario {
  idUsuarioEmisor: string;
  contenidoMensaje: string;
  fechaEnvio: Date;
}

export interface ILinksUsuario {
  linkLinkendin: string;
  linkGithub: string;
  linkPortafolioPersonal: string;
}

export interface IReseniasUsuario {
  nombreUsuarioResenador: string;
  contenidoResenia: string;
  calificacionResenia: number;
}
