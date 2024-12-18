import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { PerfilPropio } from "../Modelo/PerfilPropio.ts";
import { verificadorAutenticacion } from "../../../Servicios/GestorPermisos.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/MiPerfil/Vista_MiPerfil`;

export function inicializarMiPerfil(router: Router, app: Application) {
  const miPerfil = new PerfilPropio();

  // <!----------> Cual es la diferencia entre estos 2?
  router.get(
    "/verMiPerfil",
    verificadorAutenticacion,
    miPerfil.mostrarPaginaVerMiPerfil
  );
  router.get(
    "/verPerfil",
    verificadorAutenticacion,
    miPerfil.mostrarPaginaVerPerfil
  );
  router.get(
    "/verEditarDatosPerfil",
    verificadorAutenticacion,
    miPerfil.mostrarPaginaEditarMiPerfil
  );

  router.post(
    "/editarDatosPerfil",
    verificadorAutenticacion,
    miPerfil.editarDatosPerfil
  );

  app.use(
    cargarArchivosEstaticos(
      "/css_MiPerfil",
      directorioVistaSeccionActual + `/css_MiPerfil`
    )
  );
  app.use(
    cargarArchivosEstaticos(
      "/js_MiPerfil",
      directorioVistaSeccionActual + `/js_MiPerfil`
    )
  );

  app.use(
    cargarArchivosEstaticos(
      "/img_MiPerfil",
      directorioVistaSeccionActual + `/img_MiPerfil`
    )
  );
}
