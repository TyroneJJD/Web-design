import { Context, send } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const env = config();

export async function obtenerTokenAuth() {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SECRET_JWT_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function cargarArchivosEstaticos(prefix: string) {
  return async (context: Context, next: () => Promise<unknown>) => {
    if (context.request.url.pathname.startsWith(prefix)) {
      await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}`,
      });
    } else {
      await next();
    }
  };
}

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
    }
  } else {
    ctx.response.redirect("/login");
  }
};
