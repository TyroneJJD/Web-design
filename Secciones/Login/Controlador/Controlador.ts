import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { IniciarSession } from "../Modelo/IniciarSesion.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Login/Vista`;

export function inicializarLogin(router: Router, app: Application) {
  const inicioSesion = new IniciarSession();

  router.get("/login", inicioSesion.mostrarPaginaInicioDeSesion);
  router.post("/login", async (contexto: Context) => {
    await inicioSesion.manejadorInicioSesion(contexto);
  });

  app.use(cargarArchivosEstaticos("/img", directorioVistaSeccionActual + `/img`));
  app.use(
    cargarArchivosEstaticos("/css", directorioVistaSeccionActual + `/css`)
  );
  app.use(cargarArchivosEstaticos("/js", directorioVistaSeccionActual + `/js`));
  
}
