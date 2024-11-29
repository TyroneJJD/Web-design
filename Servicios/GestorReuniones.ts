import { GoogleApis } from "npm:googleapis";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";

export class GestorReuniones {
  private auth;
  private calendar;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    const env = config();
    this.clientId = env.CLIENT_ID;
    this.clientSecret = env.CLIENT_SECRET;
    this.redirectUri = env.REDIRECT_URI;

    const googleApis = new GoogleApis();
    this.auth = new googleApis.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
    this.calendar = googleApis.calendar({ version: "v3", auth: this.auth });
  }

  /**
   * Genera la URL de autorización y redirige al usuario.
   */
  public identificacion(context: Context): void {
    const url = this.auth.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });

    context.response.redirect(url);
  }

  /**
   * Genera una reunión en Google Calendar con Google Meet.
   */

  // AQUI TENEMOS UN PROBLEMA GIGANTE
  public async generarReunion(context: Context): Promise<void> {
    const urlParams = context.request.url.searchParams;
    const code = urlParams.get("code");

    if (!code) {
      context.response.status = 400;
      context.response.body = "Falta el código de autorización.";
      return;
    }

    try {
      // Intercambiar código por tokens
      const { tokens } = await this.auth.getToken(code);
      this.auth.setCredentials(tokens);

      // Crear un evento en Google Calendar
      const event = {
        summary: "SUPER Reunión Tilina",
        description: "Descripción de la reunión de prueba.",
        start: {
          dateTime: new Date(
            new Date().getTime() + 60 * 60 * 12000
          ).toISOString(),
          timeZone: "America/Mexico_City",
        },
        end: {
          dateTime: new Date(
            new Date().getTime() + 60 * 60 * 13000
          ).toISOString(),
          timeZone: "America/Mexico_City",
        },
        conferenceData: {
          createRequest: {
            requestId: "some-random-string",
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        attendees: [
          { email: "juliandorantes2004@gmail.com" },
          { email: "tyronejjd24@gmail.com" },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        conferenceDataVersion: 1,
      });

      context.response.body = {
        message: "Reunión creada",
        event: response.data,
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = { message: "Error al crear la reunión", error };
    }
  }
}
