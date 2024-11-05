export interface SesionEntrevista {
  idReunion: string;
  horaInicio: Date;
  horaFin: Date;
  nombreEntrevistado: string;
  correoElectronicoEntrevistado: string;
  sesionOcupada: boolean;
}

export interface FechaPropia {
  numeroDia: number;
  nombreDiaSemana: string;
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

  public obtenerDiasDelMes(): FechaPropia[] {
    const weekdays = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    // Array para almacenar los días del mes
    const calendar: FechaPropia[] = [];

    // Calcula el número total de días en el mes
    const daysInMonth = new Date(
      this.fechaInicio.getFullYear(),
      this.fechaInicio.getMonth(),
      0
    ).getDate();

    // Recorre cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Obtiene el día de la semana (0 = Domingo, 6 = Sábado)
      const date = new Date(
        this.fechaInicio.getFullYear(),
        this.fechaInicio.getMonth() - 1,
        day
      );
      const diaSemana = weekdays[date.getDay()];

      // Agrega el día al calendario con el tipo FechaPropia
      calendar.push({ numeroDia: day, nombreDiaSemana: diaSemana });
    }

    return calendar;
  }
}
