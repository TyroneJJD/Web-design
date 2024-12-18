import { Context, send } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";

export function verificarVariablesDeEntornoDefinidas(): void {
  const env = config();

  const variablesRequeridas = [
    "MONGO_URI",
    "MAILGUN_API_KEY",
    "MAILGUN_DOMAIN",
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "SECRET_JWT_KEY",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "REDIRECT_URI",
  ];

  for (const variable of variablesRequeridas) {
    if (!verificarVariableDeEntorno(variable, env)) {
      throw new Error(
        `La variable de entorno ${variable} no está definida o está vacía.`
      );
    }
  }
}

function verificarVariableDeEntorno(
  variable: string,
  env: Record<string, string>
): boolean {
  const valor = env[variable] ?? Deno.env.get(variable);
  if (!valor || valor.trim() === "") {
    console.error(
      `La variable de entorno ${variable} no está definida o está vacía.`
    );
    return false;
  }
  return true;
}

export async function renderizarVista(
  template: string,
  data: object,
  viewsPath: string
) {
  return await renderFile(template, data, { views: viewsPath });
}

async function leerHTMLDesdeArchivo(ruta: string): Promise<string> {
  try {
    const contenido = await Deno.readTextFile(Deno.cwd() + "/ComponentesComunes/plantillasGenerales/" + ruta);
    return contenido;
  } catch (error) {
    console.error("Error al leer el archivo HTML:", error);
    throw new Error("No se pudo leer el archivo HTML.");
  }
}

export async function renderizarVistaV2(
  template: string,
  data: object,
  viewsPath: string
): Promise<string> {
  const navbar = await leerHTMLDesdeArchivo("navbar.html");
  const footer = await leerHTMLDesdeArchivo("footer.html");

  try {
    const datosConHTML = {
      ...data,
      navbar,
      footer,
    };

    configure({ autoEscape: false });
    const rendered = await renderFile(template, datosConHTML, {
      views: viewsPath,
    });
    if (!rendered) {
      throw new Error(
        "No se pudo renderizar la vista. Verifica la plantilla y los datos."
      );
    }
    return rendered;
  } catch (error) {
    console.error("Error al renderizar la vista:", error);
    throw new Error(
      "No se pudo renderizar la vista. Verifica la plantilla y los datos."
    );
  }
}

export function cargarArchivosEstaticos(prefix: string, carpetaRaiz: string) {
  return async (context: Context, next: () => Promise<unknown>) => {
    if (context.request.url.pathname.startsWith(prefix)) {
      const filePath = context.request.url.pathname.substring(prefix.length);
      await send(context, filePath, {
        root: carpetaRaiz,
      });
    } else {
      await next();
    }
  };
}

export function paginaNoEncontrada() {
  return async (context: Context, next: () => Promise<unknown>) => {
    try {
      await next();
      if (context.response.status === 404) {
        context.response.redirect("/NotFound");
      }
    } catch (err) {
      console.error("Error en el middleware:", err);
    }
  };
}
