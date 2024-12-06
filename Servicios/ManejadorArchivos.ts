/// <reference lib="deno.ns" />

import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class ManejadorArchivos {
  private storageBucketUrl =
    `https://firebasestorage.googleapis.com/v0/b/` +
    env.FIREBASE_STORAGE_BUCKET +
    `/o`;

  public async guardarArchivo(
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

  public async obtenerImagen(urlImagen: string): Promise<string | null> {
    try {
      const respuesta = await fetch(urlImagen);
  
      if (!respuesta.ok) {
        throw new Error(`Error al descargar la imagen: ${respuesta.statusText}`);
      }
  
      const imageData = new Uint8Array(await respuesta.arrayBuffer());
  
      // Convertir los datos de la imagen a Base64
      const base64String = btoa(
        String.fromCharCode(...imageData)
      );
  
      // Devolver la cadena Base64 junto con el prefijo de tipo MIME
      const contentType = respuesta.headers.get("Content-Type") || "image/png";
      return `data:${contentType};base64,${base64String}`;
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
      return null;
    }
  }
  

  public async eliminarArchivo(imageUrl: string) {
    try {
      const storageBucketUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o`;

      const filePath = this.obtenerUbicacionArchivo(imageUrl);
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

  private obtenerUbicacionArchivo(url: string): string {
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o/`;
    if (url.startsWith(baseUrl)) {
      return decodeURIComponent(url.replace(baseUrl, "").split("?")[0]);
    } else {
      throw new Error("URL proporcionada no es válida.");
    }
  }

  public async guardarFotoDePerfil(
    archivoJSON: { fileName: string; base64: string },
    idUsuario: string
  ): Promise<string> {
    const { fileName, base64 } = archivoJSON;
    const nombreCarpeta = "FotosPerfil";

    const datosArchivo = new Uint8Array(
      atob(base64.split(",")[1]).split("").map((char) => char.charCodeAt(0))
    );

    const mimeType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";")); 
    console.log(mimeType)
  
    const urlDeSubida = `${this.storageBucketUrl}/${encodeURIComponent(
      nombreCarpeta + "/" + idUsuario
    )}?uploadType=media&name=${idUsuario}`;
  
    const respuestaAPI = await fetch(urlDeSubida, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.FIREBASE_API_KEY}`,
        "Content-Type": mimeType,
      },
      body: datosArchivo,
    });
  
    if (!respuestaAPI.ok) {
      throw new Error("Error al subir el archivo: " + respuestaAPI.statusText);
    }
  
    const responseBody = await respuestaAPI.json();
    const tokenArchivo = responseBody.downloadTokens;

    let url = `https://firebasestorage.googleapis.com/v0/b/${
      env.FIREBASE_STORAGE_BUCKET
    }/o/${encodeURIComponent(nombreCarpeta + "/" + idUsuario)}?alt=media&token=${tokenArchivo}`;

    console.log(url)
    return url;
  }


  public async guardarFotoDeBackground(
    archivoJSON: { fileName: string; base64: string },
    idUsuario: string
  ): Promise<string> {
    const { fileName, base64 } = archivoJSON;
    const nombreCarpeta = "FotosBackground";
  
    console.log(base64.split(",")[1]);
    const datosArchivo = new Uint8Array(
      atob(base64.split(",")[1]).split("").map((char) => char.charCodeAt(0))
    );

    const mimeType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";")); 
    console.log(mimeType)
  
    const urlDeSubida = `${this.storageBucketUrl}/${encodeURIComponent(
      nombreCarpeta + "/" + idUsuario
    )}?uploadType=media&name=${idUsuario}`;
  
    const respuestaAPI = await fetch(urlDeSubida, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.FIREBASE_API_KEY}`,
        "Content-Type": mimeType,
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
    }/o/${encodeURIComponent(nombreCarpeta + "/" + idUsuario)}?alt=media&token=${tokenArchivo}`;
  }
  
}
