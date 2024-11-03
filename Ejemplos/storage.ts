import { AlmacenamientoArchivos } from "../Modelo/StorageService.ts";

const storageService = new AlmacenamientoArchivos();

const url = storageService
  .uploadFile("./imagen.jpg", "ResumePablo")
  .then(() => console.log("Operación completada"))
  .catch((error: any) => console.error("Error en la subida:", error));
console.log(url);

storageService.descargarArchivo(
  "https://firebasestorage.googleapis.com/v0/b/senatus-a1.appspot.com/o/Resumes%2FResumePablo?alt=media&token=66cd7443-b8d8-4381-a530-1e568a9ca117",
  "./imagen22.jpg"
);
storageService.eliminarArchivo(
  "https://firebasestorage.googleapis.com/v0/b/senatus-a1.appspot.com/o/Resumes%2FResumePablo?alt=media&token=7025095a-7f4e-479e-908d-c80f4a58bfa8"
);
