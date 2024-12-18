
// <!----------> FULL REFACTOR PARA MONGODB

/*import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";

import { verificadorAutenticacion } from "../../../Servicios/Autenticacion.ts";
import { GestorProblemasProgramacionCompetitiva } from "../Modelo/GestorProblemasCompetitiva.ts";


export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PanelAdministrador/Vista_PanelAdministrador`;

export function inicializarPanelAdmin_ProblemasCompetitiva(
  router: Router,
  app: Application
) {
  const gestorProblemas = new GestorProblemasProgramacionCompetitiva();
  router.get(

    "/AdminPanel_ProblemasCompetitiva",

    gestorProblemas.BuscadorProblemasProgramacionCompetitiva
  );

  router.get(

    "/AdminPanel_ProblemasCompetitivaEspecifico",

    gestorProblemas.BuscadorProblemasProgramacionCompetitivaEspecifico
  );

  router.get(

    "/AdminPanel_EliminarProblemasCompetitiva",
    gestorProblemas.eliminarProblemaProgramacionCompetitiva
  );

  router.get(

    "/AdminPanel_AgregarProblemasCompetitiva",
    gestorProblemas.agregarProblemaProgramacionCompetitiva
  );

  router.get(

    "/AdminPanel_ModificarProblemasCompetitiva",

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
*/