/// <reference lib="deno.ns" />
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class AlmacenamientoArchivos {
  private storageBucketUrl =
    `https://firebasestorage.googleapis.com/v0/b/` +
    env.FIREBASE_STORAGE_BUCKET +
    `/o`;

  public async subirArchivo(
    filePath: string,
    fileName: string
  ): Promise<string> {
    const datosArchivo = await Deno.readFile(filePath);
    const nombreCarpeta = "Resumes";
    const urlDeSubida = `${this.storageBucketUrl}/${encodeURIComponent(
      nombreCarpeta + "/" + fileName
    )}?uploadType=media&name=${fileName}`;

    const respuestaAPI = await fetch(urlDeSubida, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.FIREBASE_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      body: datosArchivo,
    });

    if (!respuestaAPI.ok) {
      throw new Error("Error al subir el archivo: " + respuestaAPI.statusText);
    }

    const responseBody = await respuestaAPI.json();
    const tokenArchivo = responseBody.downloadTokens;
    return `https://firebasestorage.googleapis.com/v0/b/${
      env.FIREBASE_STORAGE_BUCKET
    }/o/${encodeURIComponent(
      nombreCarpeta + "/" + fileName
    )}?alt=media&token=${tokenArchivo}`;
  }

  public async descargarArchivo(urlImagen: string, rutaDeGuardado: string) {
    try {
      const respuesta = await fetch(urlImagen);

      if (!respuesta.ok) {
        throw new Error(
          `Error al descargar la imagen: ${respuesta.statusText}`
        );
      }

      const imageData = new Uint8Array(await respuesta.arrayBuffer());

      await Deno.writeFile(rutaDeGuardado, imageData);
      console.log(`Imagen descargada y guardada en: ${rutaDeGuardado}`);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    }
  }

  public async eliminarArchivo(imageUrl: string) {
    try {
      const storageBucketUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o`;

      const filePath = this.obtenerRutaDelURL(imageUrl);
      const deleteUrl = `${storageBucketUrl}/${encodeURIComponent(
        filePath
      )}?token=${env.FIREBASE_API_KEY}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${env.FIREBASE_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el archivo: ${response.statusText}`);
      }

      console.log("Archivo eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  }

  private obtenerRutaDelURL(url: string): string {
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o/`;
    if (url.startsWith(baseUrl)) {
      return decodeURIComponent(url.replace(baseUrl, "").split("?")[0]);
    } else {
      throw new Error("URL proporcionada no es válida.");
    }
  }
}
