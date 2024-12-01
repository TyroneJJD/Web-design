import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { IniciarSession } from "../Modelo/IniciarSesion.ts";
import { crearNuevaCuenta } from "../Modelo/CrearNuevaCuenta.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/Login/Vista_Login`;

export function inicializarLogin(router: Router, app: Application) {
  const inicioSesion = new IniciarSession();

  router.get("/login", inicioSesion.mostrarPaginaInicioDeSesion);
  router.post("/login", async (contexto: Context) => {
    await inicioSesion.manejadorInicioSesion(contexto);
  });

  const nuevaCuenta = new crearNuevaCuenta();
  router.get("/tipoUsuario", nuevaCuenta.mostrarPaginaRegistro);
  router.get("/registro", nuevaCuenta.mostrarPaginaFormularioRegistro);
  

  app.use(cargarArchivosEstaticos("/img_Login", directorioVistaSeccionActual + `/img_Login`));
  app.use(
    cargarArchivosEstaticos("/css_Login", directorioVistaSeccionActual + `/css_Login`)
  );
  app.use(cargarArchivosEstaticos("/js_Login", directorioVistaSeccionActual + `/js_Login`));
  
}
