import { CorreoElectronico } from "../Modelo/CorreoElectronico.ts";

const mailgunService = new CorreoElectronico();

mailgunService.enviarCorreoNuevaReunionEntrevistador(
  "pabloten56@hotmail.com",
  "luisito",
  "https://meet.google.com/"
);
