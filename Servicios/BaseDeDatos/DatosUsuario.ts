import { ObjectId } from "npm:mongodb";

export interface IUsuario {
  _id?: ObjectId;

  nombreUsuario: string;
  apellidoUsuario: string;
  correoElectronicoInstitucionalUsuario: string;
  contraseniaUsuario: string;

  datosPersonalesUsuario: IDatosPersonalesUsuario;
  reseniasUsuario: IReseniasUsuario[];
  permisosUsuario: IPermisosUsuario;
}

export interface IDatosPersonalesUsuario {
  correoElectronicoGmailUsuario: string;
  titularUsuario: string;
  descripcionUsuario: string;
  linksUsuario: ILinksUsuario;
  direccionURLFotoPerfil: string;
  direccionURLFotoBackground: string;
}

export interface IPermisosUsuario {
  quiereSerCoach: boolean;
  esAdministrador: boolean;
  esCoach: boolean;
  puedePublicarEnElBlog: boolean;
  puedePublicarProblemas: boolean;
}

export interface ILinksUsuario {
  linkLinkendin: string;
  linkGithub: string;
  linkPortafolioPersonal: string;
}

//No usado por el momento
export interface IMensajesusuario {
  idUsuarioEmisor: string;
  contenidoMensaje: string;
  fechaEnvio: Date;
}

//No usado por el momento
export interface IReseniasUsuario {
  nombreUsuarioResenador: string;
  contenidoResenia: string;
  calificacionResenia: number;
}
