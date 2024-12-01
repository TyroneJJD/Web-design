import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { ScraperInterships } from "../Modelo/ScraperInterships.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/BuscadorInterships/Vista_BuscadorInterships`;

export function inicializarBuscadorInterships(
  router: Router,
  app: Application
) {
  const interships = new ScraperInterships();
  router.get("/BuscadorIntershipsV2", interships.visualizarInterships);

  app.use(
    cargarArchivosEstaticos(
      "/css_BuscadorInterships",
      directorioVistaSeccionActual + `/css_BuscadorInterships`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_BuscadorInterships",
      directorioVistaSeccionActual + `/js_BuscadorInterships`
    )
  );
}
