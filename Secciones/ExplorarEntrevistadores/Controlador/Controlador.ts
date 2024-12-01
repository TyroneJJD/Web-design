
import {
  Application,
  Router,

} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  cargarArchivosEstaticos,

} from "../../../utilidadesServidor.ts";
import { ManejadorEntrevistador } from "../Modelo/Entrevistador.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/ExplorarEntrevistadores/Vista_ExplorarEntrevistadores`;

export function inicializarExplorarEntrevistadores(
  router: Router,
  app: Application
) {

  const entrevistadores = new ManejadorEntrevistador();
  router.get("/ExplorarEntrevistadores", entrevistadores.visualizarExplorarEntrevistadores);

  app.use(
    cargarArchivosEstaticos("/css_ExplorarEntrevistadores", directorioVistaSeccionActual + `/css_ExplorarEntrevistadores`)
  );
  app.use(cargarArchivosEstaticos("/js_ExplorarEntrevistadores", directorioVistaSeccionActual + `/js_ExplorarEntrevistadores`));
}


