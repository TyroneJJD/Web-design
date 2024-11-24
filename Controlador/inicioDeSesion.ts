import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { OperacionesAdministrador } from "../BaseDatos/operacionesAdministrador.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";


export async function mostrarPaginaInicioDeSesion(context: Context) {
  const html = await renderFile("login.html", {});
  context.response.body = html || "Error al renderizar la página";
}

export async function manejadorInicioSesion(context: Context) {
  const credenciales = await obtenerDatosFormularioInicioDeSesion(context);

  if (!credenciales) {
    context.response.status = 400;
    context.response.body = "Formato de cuerpo no soportado.";
    return;
  }

  const { email, password } = credenciales;
  const verificator = new OperacionesAdministrador();

  if (email && password) {
    const userDataExists = await verificator.recuperarDatosEntrevistado(
      email,
      password
    );

    if (userDataExists) {
      const key = await obtenerTokenAuth();
      const jwt = await create(
        { alg: "HS256", typ: "JWT" },
        {
          username: userDataExists.nombreEntrevistado,
          id: userDataExists._id,
          email: userDataExists.correoElectronicoEntrevistado,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        key
      );

      context.cookies.set("auth_token", jwt, { httpOnly: true, secure: false });
      context.response.redirect("/protected");
    } else {
      context.response.status = 401;
      context.response.body = "Credenciales incorrectas";
    }
  } else {
    context.response.status = 400;
    context.response.body = "Username and password must not be null.";
  }
}

async function obtenerDatosFormularioInicioDeSesion(
  ctx: Context
): Promise<{ email: string | null; password: string | null } | null> {
  const result = await ctx.request.body();

  if (result.type === "form") {
    const body = await result.value; // Obtiene el valor del cuerpo del formulario
    const email = body.get("email");
    const password = body.get("password");
    return { email, password };
  }

  return null; // Devuelve null si el formato no es soportado
}

export async function obtenerTokenAuth() {
  const env = config();
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SECRET_JWT_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}