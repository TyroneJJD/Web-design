import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

export const verificadorAutenticacion = async (
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
      ctx.response.redirect("/login");
    }
  } else {
    ctx.response.redirect("/login");
  }
};



async function obtenerTokenAuth() {
  const env = config();
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SECRET_JWT_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export const obtenerDatosToken = async (ctx: Context): Promise<any> => {
  const token = await ctx.cookies.get("auth_token");
  if (token) {
    try {
      const key = await obtenerTokenAuth();
      const payload = await verify(token, key);
      return payload; // Retornar los datos decodificados del token
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return null;
    }
  }
  return null; // Si no hay token, retornar null
};

export const obtenerIdUsuario = async (ctx: Context): Promise<string | null> => {
  const token = await ctx.cookies.get("auth_token");
  if (token) {
    try {
      const key = await obtenerTokenAuth();
      const payload = await verify(token, key);
      return (payload as { _id: string })._id; // Retornar el ID del usuario
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return null;
    }
  }
  return null; // Si no hay token, retornar null
};

export const obtenerNombresUsuario = async (ctx: Context): Promise<string | null> => {
  const token = await ctx.cookies.get("auth_token");
  if (token) {
    try {
      const key = await obtenerTokenAuth();
      const payload = await verify(token, key);
      const nombre =  (payload as { nombreUsuario: string }).nombreUsuario;
      return nombre;
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return null;
    }
  }
  return null; // Si no hay token, retornar null
};


export const obtenerApellidoUsuario = async (ctx: Context): Promise<string | null> => {
  const token = await ctx.cookies.get("auth_token");
  if (token) {
    try {
      const key = await obtenerTokenAuth();
      const payload = await verify(token, key);
      const apellido =  (payload as { apellidoUsuario: string }).apellidoUsuario; 
      return apellido;
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return null;
    }
  }
  return null; // Si no hay token, retornar null
};


export const verificarSiEsAdministrador = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const token = await ctx.cookies.get("auth_token");

  if (token) {
    const key = await obtenerTokenAuth();

    try {
      const payload = await verify(token, key);

      if (payload.esAdministrador === true) {
        ctx.state.user = payload;
        await next();
      } else {
        ctx.response.status = 403;
        ctx.response.body = "Acceso denegado. No eres un administrador valido.";
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      ctx.response.status = 401;
      ctx.response.body = "Token inválido o expirado";
    }
  } else {
    ctx.response.redirect("/login");
  }
};


export const verificarSiPuedePublicarEnBlog = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const token = await ctx.cookies.get("auth_token");

  if (token) {
    const key = await obtenerTokenAuth();

    try {
      const payload = await verify(token, key);

      if (payload.puedePublicarEnElBlog === true) {
        ctx.state.user = payload;
        await next();
      } else {
        ctx.response.status = 403;
        ctx.response.body = "Acceso denegado. No tienes permisos para publicar en el blog.";
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      ctx.response.status = 401;
      ctx.response.body = "Token inválido o expirado";
    }
  } else {
    ctx.response.redirect("/login");
  }
};


export const verificarSiPuedePublicarProblemas = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const token = await ctx.cookies.get("auth_token");

  if (token) {
    const key = await obtenerTokenAuth();

    try {
      const payload = await verify(token, key);

      if (payload.puedePublicarProblemas === true) {
        ctx.state.user = payload;
        await next();
      } else {
        ctx.response.status = 403;
        ctx.response.body = "Acceso denegado. No tienes permiso para publicar problemas.";
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      ctx.response.status = 401;
      ctx.response.body = "Token inválido o expirado";
    }
  } else {
    ctx.response.redirect("/login");
  }
};

export const verificarSiEsCoach = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const token = await ctx.cookies.get("auth_token");

  if (token) {
    const key = await obtenerTokenAuth();

    try {
      const payload = await verify(token, key);

      if (payload.isCoach === true) {
        ctx.state.user = payload;
        await next();
      } else {
        ctx.response.status = 403;
        ctx.response.body = "Acceso denegado. No eres un Coach.";
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      ctx.response.status = 401;
      ctx.response.body = "Token inválido o expirado";
    }
  } else {
    ctx.response.redirect("/login");
  }
};







