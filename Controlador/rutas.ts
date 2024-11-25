import {
  mostrarPaginaInicio,
  mostrarPaginaProtegida,
} from "./visualizacionPaginasGeneral.ts";

import {
  manejadorSubidaArchivo,
  mostrarSubidaArchivos,
} from "./subidaArchivo.ts";

import {
  mostrarPaginaInicioDeSesion,
  manejadorInicioSesion,
  obtenerTokenAuth,
} from "./inicioDeSesion.ts";

import {
  mostrarPaginaEditorTexto,
  mostrarPublicacion,
  guardarPublicacion,
} from "./Blog.ts";

import { identificacion, generarReunion } from "../Modelo/Reunion.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

export function arrancarRutas(router: Router) {
  router.get("/", mostrarPaginaInicio);

  router.get("/editorTexto", mostrarPaginaEditorTexto);
  router.post("/save-content", async (contexto: Context) => {
    await guardarPublicacion(contexto);
  });

  router.get("/view-content/:id", async (context) => {
    await mostrarPublicacion(context, context.params.id);
  });

  router.get("/subida", mostrarSubidaArchivos);
  router.post("/subida", async (contexto: Context) => {
    await manejadorSubidaArchivo(contexto);
  });

  router.get("/login", mostrarPaginaInicioDeSesion);
  router.post("/login", async (contexto: Context) => {
    await manejadorInicioSesion(contexto);
  });

  router.get("/protected", verificadorAutenticacion, mostrarPaginaProtegida);

  router.get("/identificarse", identificacion);
  router.get("/oauth2callback", generarReunion);
}

const verificadorAutenticacion = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const token = await ctx.cookies.get("auth_token");

  if (token) {
    const key = await obtenerTokenAuth();

    try {
      const payload = await verify(token, key);
      ctx.state.user = payload;
      await next();
    } catch (error) {
      console.error("Error al verificar el token:", error);
      ctx.response.status = 401;
      ctx.response.body = "Token inválido o expirado";
    }
  } else {
    ctx.response.redirect("/login");
  }
};
