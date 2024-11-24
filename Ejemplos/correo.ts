import { CorreoElectronico } from "../Modelo/CorreoElectronico.ts";

const mailgunService = new CorreoElectronico();

mailgunService.enviarCorreoNuevaReunionParaEntrevistador(
  "pabloten56@hotmail.com",
  "luisito",
  "https://meet.google.com/"
);
