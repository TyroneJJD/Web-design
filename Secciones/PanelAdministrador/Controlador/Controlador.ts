import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { cargarArchivosEstaticos } from "../../../utilidadesServidor.ts";
import { GestorPermisos } from "../Modelo/GestorPermisos.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { verificadorAutenticacion, verificarSiEsAdministrador } from "../../../Servicios/Autenticacion.ts";

export const directorioVistaSeccionActual = `${Deno.cwd()}/Secciones/PanelAdministrador/Vista_PanelAdministrador`;

export function inicializarPanelAdministrador(
  router: Router,
  app: Application
) {
  const gestorPermisos = new GestorPermisos();
  router.get(
    "/panelPermisosUsuarios",
    verificadorAutenticacion,
    verificarSiEsAdministrador,
    gestorPermisos.mostrarPanelPermisosUsuarios
  );

  router.post("/api/actualizar-permisos", async (ctx: Context) => {
    const { idUsuario, permiso, estado } = await ctx.request.body().value;

    if (!idUsuario) {
      ctx.response.status = 400;
      ctx.response.body = "ID de usuario no válido";
      return;
    }

    const resultado = await gestorPermisos.actualizarPermisos(
      idUsuario,
      permiso,
      estado
    );

    if (resultado === "Permiso actualizado correctamente") {
      ctx.response.status = 200;
    } else {
      ctx.response.status = 400;
    }
    ctx.response.body = resultado;
  });

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
