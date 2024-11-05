import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { AlmacenamientoArchivos } from "../Modelo/AlmacenamientoArchivos.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

export async function mostrarSubidaArchivos(context: Context) {
  const html = await renderFile("subidaArchivos.html", {
    user: context.state.user,
  });
  context.response.body = html || "Error al renderizar la página";
}

export async function manejadorSubidaArchivo(context: Context) {
  const almacenamiento = new AlmacenamientoArchivos();
  const body = context.request.body({ type: "form-data" });
  const formData = await body.value.read();
  const archivo = formData.files?.[0];

  if (archivo) {
    try {
      await almacenamiento.subirArchivo(
        archivo.filename!,
        archivo.originalName!
      );
      console.log("Archivo subido con éxito");
      context.response.status = 303; // Redirección
      //context.response.headers.set("Location", `/success?url=${encodeURIComponent(url)}`);
    } catch (error) {
      context.response.status = 303;
      const errorMessage = (error as Error).message;
      console.log(errorMessage);
      //context.response.headers.set("Location", `/error?msg=${encodeURIComponent(errorMessage)}`);
    }
  } else {
    context.response.status = 400;
    console.log("No se recibio archivo");
    //context.response.body = "No se ha recibido ningún archivo.";
  }
}
