import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { PerfilPropio } from "../Modelo/PerfilPropio.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/MiPerfil/Vista_MiPerfil`;

export function inicializarMiPerfil(router: Router, app: Application) {
  const miPerfil = new PerfilPropio();
  router.get("/verMiPerfil", miPerfil.mostrarPaginaVerMiPerfil);
  router.get("/verEditarDatosPerfil", miPerfil.mostrarPaginaEditarMiPerfil);

  router.post("/editarDatosPerfil", miPerfil.editarDatosPerfil);
  router.post("/editarImagenDePerfil", miPerfil.editarImagenDePerfil);
  router.post("/editarBackgroundDePerfil", miPerfil.editarBackgroundDePerfil);

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
}
