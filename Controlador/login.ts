import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { obtenerTokenAuth } from "../serverUtils.ts";
import { PeticionesAdministrador } from "../BaseDatos/peticionesAdministrador.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";

export async function renderPaginaLogin(context: Context) {
    const html = await renderFile("login.html", {});
    context.response.body = html || "Error al renderizar la página";
  }

export async function manejadorLogin(ctx: Context) {
    const credenciales = await obtenerCredenciales(ctx);
    
    if (!credenciales) {
      ctx.response.status = 400;
      ctx.response.body = "Formato de cuerpo no soportado.";
      return;
    }
    
    const { email, password } = credenciales;
    const verificator = new PeticionesAdministrador();
  
    if (email && password) {
      const userdata = await verificator.recuperarDatosEntrevistado(email, password);
      
      if (userdata) { // Si el usuario existe en la db
        const key = await obtenerTokenAuth();
        const jwt = await create(
          { alg: "HS256", typ: "JWT" },
          { 
            username: userdata.nombreEntrevistado,
            id: userdata._id,
            email: userdata.correoElectronicoEntrevistado,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
          },
          key
        );
  
        ctx.cookies.set("auth_token", jwt, { httpOnly: true, secure: false });
        ctx.response.redirect("/protected");
      } else {
        ctx.response.status = 401;
        ctx.response.body = "Credenciales incorrectas";
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Username and password must not be null.";
    }
  }
  
  
  async function obtenerCredenciales(ctx: Context): Promise<{ email: string | null; password: string | null } | null> {
    const result = await ctx.request.body();
  
    if (result.type === "form") {
      const body = await result.value; // Obtiene el valor del cuerpo del formulario
      const email = body.get("email");
      const password = body.get("password");
      return { email, password };
    }
  
    return null; // Devuelve null si el formato no es soportado
  }