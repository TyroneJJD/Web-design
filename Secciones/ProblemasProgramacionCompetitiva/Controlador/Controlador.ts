import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { GestorProblemasProgramacionCompetitiva } from "../Modelo/GestorProblemasProgramacionCompetitiva.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/ProblemasProgramacionCompetitiva/Vista_ProblemasProgramacionCompetitiva`;

export function inicializarProblemasProgramacionCompetitiva(
  router: Router,
  app: Application
) {
  const gestorProblemas = new GestorProblemasProgramacionCompetitiva();
  router.get(
    "/ProblemasProgramacionCompetitiva",
    gestorProblemas.BuscadorProblemasProgramacionCompetitiva
  );

  router.get(
    "/ProblemasProgramacionCompetitiva2",
    gestorProblemas.BuscadorProblemasProgramacionCompetitivaEspecifico
  );

  app.use(
    cargarArchivosEstaticos(
      "/css_ProblemasProgramacionCompetitiva",
      directorioVistaSeccionActual + `/css_ProblemasProgramacionCompetitiva`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_ProblemasProgramacionCompetitiva",
      directorioVistaSeccionActual + `/js_ProblemasProgramacionCompetitiva`
    )
  );
}
