import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { GestorProblemasProgramacionCompetitiva } from "../Modelo/GestorPrueba.ts";
import { verificadorAutenticacion } from "../../../Servicios/Autenticacion.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PanelAdministrador/Vista_PanelAdministrador`;

export function inicializarPrueba(
  router: Router,
  app: Application
) {
  const gestorProblemas = new GestorProblemasProgramacionCompetitiva();
  router.get(
    "/Prueba",
    verificadorAutenticacion,
    gestorProblemas.BuscadorProblemasProgramacionCompetitiva
  );

  router.get(
    "/PruebaEspecifico",
    verificadorAutenticacion,
    gestorProblemas.BuscadorProblemasProgramacionCompetitivaEspecifico
  );

  router.get(
    "/EliminarProblema",
    verificadorAutenticacion,
    gestorProblemas.eliminarProblemaProgramacionCompetitiva
  );

  router.get(
    "/AgregarProblema",
    verificadorAutenticacion,
    gestorProblemas.agregarProblemaProgramacionCompetitiva
  );

  router.get(
    "/ModificarProblema",
    verificadorAutenticacion,
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
