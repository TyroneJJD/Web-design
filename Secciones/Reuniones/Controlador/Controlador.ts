import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { CalendarioEntrevistador } from "../Modelo/CalendarioEntrevistador.ts";
import { CalendarioTrainee } from "../Modelo/CalendarioTrainee.ts";
import { ReservacionEntrenador } from "../Modelo/ReservacionEntrenador.ts";
import { identificacion,generarReunion  } from "../../../Servicios/GestorReuniones.ts";
import {verificadorAutenticacion, verificarSiEsCoach} from "../../../Servicios/GestorPermisos.ts"

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Reuniones/Vista_Reuniones`;

// <!!!!!----------!!!!!> ZONA DE GUERRA
export function inicializarReuniones(
  router: Router,
  app: Application
) {

      
  router.get("/identificarse", identificacion);
  router.post("/oauth2callback", generarReunion);
  //-----------------------------------------// TERMINADO
  const gestorCalendarioEntrevistador = new CalendarioEntrevistador();
  router.get("/calendarioEntrevistador",verificadorAutenticacion, verificarSiEsCoach,gestorCalendarioEntrevistador.mostrarCalendarioEntrevistador);
  router.post("/generar-reuniones", verificadorAutenticacion,verificarSiEsCoach,gestorCalendarioEntrevistador.generarReuniones);
  router.post("/asignarCandidatoAReunion", verificadorAutenticacion, verificarSiEsCoach,gestorCalendarioEntrevistador.asignarCandidatoAReunion);

  //-----------------------------------------//
  const gestorCalendarioTrainee = new CalendarioTrainee();
  router.get("/calendarioTrainee", verificadorAutenticacion, gestorCalendarioTrainee.mostrarCalendarioTrainee);

  //-----------------------------------------//
  const gestorReservacionEntrenador = new ReservacionEntrenador();
  router.get("/reservacionEntrenador", verificadorAutenticacion, gestorReservacionEntrenador.mostrarReservacionEntrenador);
  router.post("/inscribirme-reunion",verificadorAutenticacion,  gestorReservacionEntrenador.inscribirmeASesion);
  
  app.use(
    cargarArchivosEstaticos(
      "/css_Reuniones",
      directorioVistaSeccionActual + `/css_Reuniones`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_Reuniones",
      directorioVistaSeccionActual + `/js_Reuniones`
    )
  );
}
