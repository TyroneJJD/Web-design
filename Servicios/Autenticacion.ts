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
