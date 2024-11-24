import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";



interface DatosCorreoElectronico {
  destinatario: string;
  temaCorreo: string;
  contenidoHTML: string;
}

export class CorreoElectronico {
  private apiKey: string;
  private domain: string;

  constructor() {
    const env = config();
    this.apiKey = env.MAILGUN_API_KEY;
    this.domain = env.MAILGUN_DOMAIN;
  }

  private async enviarCorreoElectronico({
    destinatario,
    temaCorreo,
    contenidoHTML,
  }: DatosCorreoElectronico): Promise<void> {
    const form = new FormData();
    form.append("from", `SUPER_PROYECTO_WEB <mailgun@${this.domain}>`);
    form.append("to", destinatario);
    form.append("subject", temaCorreo);
    form.append("html", contenidoHTML);
    //form.append("text", text);

    try {
      const response = await fetch(
        `https://api.mailgun.net/v3/${this.domain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`api:${this.apiKey}`)}`,
          },
          body: form,
        }
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mailgun API error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }

  public enviarCorreoNuevaReunionParaEntrevistador(
    corrreoElectronicoEntrevistador: string,
    nombreEntrevistado: string,
    urlReunion: string
  ): void {
    this.enviarCorreoElectronico({
      destinatario: corrreoElectronicoEntrevistador,
      temaCorreo: "Tienes una nueva reunión programada",
      contenidoHTML:
        `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
        }
        .button {
          display: inline-block;
          padding: 10px 15px;
          margin-top: 10px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reunión programada</h2>
        <p>Hola,</p>
        <p><strong> ` +
        nombreEntrevistado +
        ` </strong> ha solicitado una sesion de asesoria contigo.</p>
        <p>Puedes unirte a la reunión haciendo clic en el siguiente enlace:</p>
        <a href="` +
        urlReunion +
        `" class="button">Unirse a la reunión</a>
        <p>Si tienes alguna pregunta, no dudes en ponerte en contacto.</p>
        <p>Saludos,<br>El equipo: Umizumi</p>
      </div>
    </body>
    </html>
    `,
    });
  }

  public enviarCorreoNuevaReunionParaEntrevistado(
    corrreoElectronicoEntrevistado: string,
    nombreEntrevistador: string,
    urlReunion: string
  ): void {
    this.enviarCorreoElectronico({
      destinatario: corrreoElectronicoEntrevistado,
      temaCorreo: "Tienes una nueva reunión programada",
      contenidoHTML:
        `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
        }
        .button {
          display: inline-block;
          padding: 10px 15px;
          margin-top: 10px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reunión programada</h2>
        <p>Hola,</p>
        <p><strong> ` +
        nombreEntrevistador +
        ` </strong> ha aceptado tu solicitud de asesoria.</p>
        <p>Puedes unirte a la reunión haciendo clic en el siguiente enlace:</p>
        <a href="` +
        urlReunion +
        `" class="button">Unirse a la reunión</a>
        <p>Si tienes alguna pregunta, no dudes en ponerte en contacto.</p>
        <p>Saludos,<br>El equipo: Umizumi</p>
      </div>
    </body>
    </html>
    `,
    });
  }
}
