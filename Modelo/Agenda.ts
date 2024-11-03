// MEJORAR ADT

export interface SesionEntrevista {
  idReunion: string;
  horaInicio: Date;
  horaFin: Date;
  nombreEntrevistado: string;
  correoElectronicoEntrevistado: string;
  sesionOcupada: boolean;
}

interface FechaPropia {
  dia: number;
  diaSemana: string;
}

export class Agenda {
  private fechaInicio: Date;
  private fechaFin: Date;

  constructor(params: {
    dia: number;
    mes: number;
    anio: number;
    horaInicioDisponibilidad: number;
    minutoInicioDisponibilidad: number;
    horaFinDisponibilidad: number;
    minutoFinDisponibilidad: number;
  }) {
    const {
      dia,
      mes,
      anio,
      horaInicioDisponibilidad,
      minutoInicioDisponibilidad,
      horaFinDisponibilidad,
      minutoFinDisponibilidad,
    } = params;

    if (
      !this.isDateTimeValid(
        dia,
        mes,
        anio,
        horaInicioDisponibilidad,
        minutoInicioDisponibilidad,
        horaFinDisponibilidad,
        minutoFinDisponibilidad
      )
    ) {
      throw new Error("Los parámetros proporcionados son inválidos.");
    }

    // Las reuniones empiezan y terminan el mismo dia.
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
  }

  private isDateTimeValid(
    dia: number,
    mes: number,
    anio: number,
    horaInicio: number,
    minutoInicio: number,
    horaFin: number,
    minutoFin: number
  ): boolean {
    return (
      this.esFechaValida(dia, mes, anio) &&
      this.esHoraValida(horaInicio, minutoInicio) &&
      this.esHoraValida(horaFin, minutoFin) &&
      this.validarHorario(horaInicio, minutoInicio, horaFin, minutoFin)
    );
  }

  private validarHorario(
    horaInicio: number,
    minutoInicio: number,
    horaFin: number,
    minutoFin: number
  ): boolean {
    return (
      horaInicio < horaFin ||
      (horaInicio === horaFin && minutoInicio < minutoFin)
    );
  }

  private esFechaValida(dia: number, mes: number, anio: number): boolean {
    const fecha = new Date(anio, mes - 1, dia);
    return (
      anio > 0 &&
      fecha.getFullYear() === anio &&
      fecha.getMonth() === mes - 1 &&
      fecha.getDate() === dia
    );
  }

  private esHoraValida(hora: number, minuto: number): boolean {
    return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
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

  public obtenerDiasDelMes(year: number, month: number): FechaPropia[] {

    const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // Array para almacenar los días del mes
    const calendar: FechaPropia[] = [];

    // Calcula el número total de días en el mes
    const daysInMonth = new Date(year, month, 0).getDate();

    // Recorre cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Obtiene el día de la semana (0 = Domingo, 6 = Sábado)
      const date = new Date(year, month - 1, day);
      const diaSemana = weekdays[date.getDay()];

      // Agrega el día al calendario con el tipo FechaPropia
      calendar.push({ dia: day, diaSemana });
    }

    return calendar;
  }

  public generarIdReunion(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function obtenerDosLetras(): string {
      return letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));
    }

    return `${obtenerDosLetras()}-${obtenerDosLetras()}-${obtenerDosLetras()}`;
  }
}





