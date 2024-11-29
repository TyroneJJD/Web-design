import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

interface DatosCorreoElectronico {
  destinatario: string;
  temaCorreo: string;
  contenidoHTML: string;
}

export class ManejadorCorreoElectronico {
  private apiKey: string;
  private domain: string;

  constructor() {
    const env = config();
    this.apiKey = env.MAILGUN_API_KEY;
    this.domain = env.MAILGUN_DOMAIN;
  }

  public async enviarCorreoNuevaReunionParaEntrevistador(
    corrreoElectronicoEntrevistador: string,
    nombreEntrevistado: string,
    urlReunion: string
  ): Promise<void> {
    const plantilla = await this.cargarPlantillaCorreoElectronico(
      "correo_nueva_reunion_entrevistador.html"
    );
    const contenidoHTML = this.rellenarCamposPlantilla(plantilla, {
      nombreEntrevistado,
      urlReunion,
    });

    await this.enviarCorreoElectronico({
      destinatario: corrreoElectronicoEntrevistador,
      temaCorreo: "Tienes una nueva reunión programada",
      contenidoHTML: contenidoHTML,
    });
  }

  public async enviarCorreoNuevaReunionParaEntrevistado(
    corrreoElectronicoEntrevistado: string,
    nombreEntrevistador: string,
    urlReunion: string
  ): Promise<void> {
    const plantilla = await this.cargarPlantillaCorreoElectronico(
      "correo_nueva_reunion_entrevistado.html"
    );
    const contenidoHTML = this.rellenarCamposPlantilla(plantilla, {
      nombreEntrevistador,
      urlReunion,
    });

    await this.enviarCorreoElectronico({
      destinatario: corrreoElectronicoEntrevistado,
      temaCorreo: "Tienes una nueva reunión programada",
      contenidoHTML: contenidoHTML,
    });
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

  private async cargarPlantillaCorreoElectronico(
    archivo: string
  ): Promise<string> {
    return await Deno.readTextFile(archivo);
  }

  private rellenarCamposPlantilla(
    template: string,
    variables: Record<string, string>
  ): string {
    let resultado = template;
    for (const [clave, valor] of Object.entries(variables)) {
      resultado = resultado.replace(new RegExp(`{{${clave}}}`, "g"), valor);
    }
    return resultado;
  }
}
