interface SesionEntrevista {
  idReunion: string;
  horaInicio: Date;
  horaFin: Date;
  nombreEntrevistado: string;
  correoElectronicoEntrevistado: string;
  sesionOcupada: boolean;
}

export class Agenda {
  private fechaInicio: Date;
  private fechaFin: Date;

  constructor({
    dia,
    mes,
    anio,
    horaInicioDisponibilidad,
    minutoInicioDisponibilidad,
    horaFinDisponibilidad,
    minutoFinDisponibilidad,
  }: {
    dia: number;
    mes: number;
    anio: number;
    horaInicioDisponibilidad: number;
    minutoInicioDisponibilidad: number;
    horaFinDisponibilidad: number;
    minutoFinDisponibilidad: number;
  }) {
    this.fechaInicio = new Date(
      anio,
      mes - 1,
      dia,
      horaInicioDisponibilidad,
      minutoInicioDisponibilidad
    );
    this.fechaFin = new Date(
      anio,
      mes - 1,
      dia,
      horaFinDisponibilidad,
      minutoFinDisponibilidad
    );

    if (isNaN(this.fechaInicio.getTime()) || isNaN(this.fechaFin.getTime())) {
      throw new Error("Fecha u hora inválida.");
    }
    if (this.fechaInicio >= this.fechaFin) {
      throw new Error(
        "La fecha de inicio debe ser anterior a la fecha de fin."
      );
    }
  }

  public obtenerSesionesDeEntrevista(): SesionEntrevista[] {
    const sesiones: SesionEntrevista[] = [];

    let inicioEntrevista = new Date(this.fechaInicio);

    while (inicioEntrevista < this.fechaFin) {
      const duracionReunionEnMinutos = 30 * 60 * 1000;
      const finEntrevista = new Date(
        inicioEntrevista.getTime() + duracionReunionEnMinutos
      );

      if (finEntrevista > this.fechaFin) break;

      sesiones.push({
        idReunion: this.generarIdReunion(),
        horaInicio: new Date(inicioEntrevista),
        horaFin: new Date(finEntrevista),
        nombreEntrevistado: "NO_ASIGNADO",
        correoElectronicoEntrevistado: "NO_ASIGNADO",
        sesionOcupada: false,
      });

      const duracionToleranciaEnMinutos = 5 * 60 * 1000;
      inicioEntrevista = new Date(
        finEntrevista.getTime() + duracionToleranciaEnMinutos
      );
    }

    return sesiones;
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
