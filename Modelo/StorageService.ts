/// <reference lib="deno.ns" />
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class AlmacenamientoArchivos {
  private storageBucketUrl =
    `https://firebasestorage.googleapis.com/v0/b/` +
    env.FIREBASE_STORAGE_BUCKET +
    `/o`;

  public async uploadFile(
    rutaArchivo: string,
    nombreArchivo: string
  ): Promise<string> {
    // Leer el archivo desde el sistema de archivos
    const datosArchivo = await Deno.readFile(rutaArchivo);
    const nombreCarpeta = "Resumes";
    const urlDeSubida = `${this.storageBucketUrl}/${encodeURIComponent(
      nombreCarpeta + "/" + nombreArchivo
    )}?uploadType=media&name=${nombreArchivo}`;

    const respuestaAPI = await fetch(urlDeSubida, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.FIREBASE_API_KEY}`,
        "Content-Type": "image/jpeg", // Cambia el tipo MIME según el archivo
      },
      body: datosArchivo,
    });

    if (!respuestaAPI.ok) {
      throw new Error("Error al subir el archivo: " + respuestaAPI.statusText);
    }

    const responseBody = await respuestaAPI.json();
    const tokenArchivo = responseBody.downloadTokens;
    const urlArchivo = `https://firebasestorage.googleapis.com/v0/b/${
      env.FIREBASE_STORAGE_BUCKET
    }/o/${encodeURIComponent(
      nombreCarpeta + "/" + nombreArchivo
    )}?alt=media&token=${tokenArchivo}`;

    //console.log("Archivo subido exitosamente:", responseBody);
    //console.log("URL del archivo:", fileUrl); // Imprimir la URL donde está alojado el archivo
    return urlArchivo;
  }

  public async descargarArchivo(urlImagen: string, rutaDeGuardado: string) {
    try {
      const respuesta = await fetch(urlImagen);

      if (!respuesta.ok) {
        throw new Error(`Error al descargar la imagen: ${respuesta.statusText}`);
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
