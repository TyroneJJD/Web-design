import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { GestorReuniones } from "../Modelo/GestorReuniones.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Reuniones/Vista_Reuniones`;

export function inicializarReuniones(
  router: Router,
  app: Application
) {
  const gestorReuniones = new GestorReuniones();
  router.get("/calendarioEntrevistador", gestorReuniones.mostrarCalendarioEntrevistador);
  router.get("/calendarioTrainee", gestorReuniones.mostrarCalendarioTrainee);
  router.get("/reservacionEntrenador", gestorReuniones.mostrarReservacionEntrenador);
  router.post("/generar-reuniones", gestorReuniones.generarReuniones);
  router.post("/inscribirme-reunion", gestorReuniones.inscribirmeASesion);
  
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
