export interface ISesionEntrevista {
  _id?: string; //id de la reunion

  idCoach: string;
  horaInicio: Date;
  horaFin: Date;

  candidatosRegistrados: IDetallesCandidatosRegistrado[];
  candidatoSeleccionadoAEntrevistar: IDetallesCandidatosRegistrado;
  sesionAsignada: boolean;
}

export interface IDetallesCandidatosRegistrado {

  //------------------- Datos que ingresa el candidato
  idCandidatoRegistrado: string;
  
  nombreCandidato: string; //Para poder recuperar el nombre del candidato
  tipoDeReuinion: string;
  motivoDeLaReunion: string;
  comentariosAdicionales: string;
  linkResume: string;
  //-------------------
  estadoReunion: string;
  respuestaDelEntrevistador: string; // Este horario ya ha sido confirmado para otra persona, si la otra persona cancela la reunión hay posibilidades de que te acepten a ti

}
