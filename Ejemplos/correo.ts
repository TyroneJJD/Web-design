import { MailgunService } from "../Modelo/CorreoElectronico.ts";

const mailgunService = new MailgunService();

mailgunService.enviarCorreoNuevaReunionEntrevistador(
  "pabloten56@hotmail.com",
  "luisito",
  "https://meet.google.com/"
);
