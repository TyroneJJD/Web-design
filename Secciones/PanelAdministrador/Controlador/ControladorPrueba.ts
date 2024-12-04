import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { GestorProblemasProgramacionCompetitiva } from "../Modelo/GestorPrueba.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PanelAdministrador/Vista_PanelAdministrador`;

export function inicializarPrueba(
  router: Router,
  app: Application
) {
  const gestorProblemas = new GestorProblemasProgramacionCompetitiva();
  router.get(
    "/Prueba",
    gestorProblemas.BuscadorProblemasProgramacionCompetitiva
  );

  router.get(
    "/PruebaEspecifico",
    gestorProblemas.BuscadorProblemasProgramacionCompetitivaEspecifico
  );

  router.get(
    "/EliminarProblema",
    gestorProblemas.eliminarProblemaProgramacionCompetitiva
  );

  router.get(
    "/AgregarProblema",
    gestorProblemas.agregarProblemaProgramacionCompetitiva
  );

  router.get(
    "/ModificarProblema",
    gestorProblemas.modificarProblemaProgramacionCompetitiva
  );

  app.use(
    cargarArchivosEstaticos(
      "/css_PanelAdministrador",
      directorioVistaSeccionActual + `/css_PanelAdministrador`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_PanelAdministrador",
      directorioVistaSeccionActual + `/js_PanelAdministrador`
    )
  );
}
