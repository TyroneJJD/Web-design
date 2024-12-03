import { GoogleApis } from "npm:googleapis";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";

export function identificacion(context: Context) {
    const env = config();
    const googleApis = new GoogleApis();
  const auth = new googleApis.auth.OAuth2(
    env.CLIENT_ID,
    env.CLIENT_SECRET,
    env.REDIRECT_URI
  );

  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  context.response.redirect(url);
}

export async function generarReunion(context: Context) {
    const env = config();
    const urlParams = context.request.url.searchParams;
    const code = urlParams.get("code");
  
    if (!code) {
      context.response.status = 400;
      context.response.body = "Falta el código de autorización.";
      return;
    }
  
    // Configurar cliente OAuth2 con las credenciales proporcionadas directamente en el código
    const googleApis = new GoogleApis();
    const auth = new googleApis.auth.OAuth2(
      env.CLIENT_ID,
      env.CLIENT_SECRET,
      env.REDIRECT_URI
    );
  
    // Intercambiar código por tokens
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
  
    // Crear un evento en Google Calendar con Google Meet
    const calendar = googleApis.calendar({ version: "v3", auth });
    const event = {
      summary: "HIPER Reunión Tilina",
      description: "Descripción de la reunión de prueba.",
      start: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 12000).toISOString(),
        timeZone: "America/Mexico_City",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 13000).toISOString(),
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
        { email: "tyronejjd24@gmail.com"}
      ],
      reminders: {
        useDefault: false, // Deshabilitar recordatorios predeterminados
        overrides: [
          { method: "email", minutes: 24 * 60 }, // Recordatorio por correo, 24 horas antes
          { method: "popup", minutes: 10 }, // Recordatorio emergente, 10 minutos antes
        ],
      }
    };
  
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    console.log(response.data);
  
    context.response.status = 302; // Redirección temporal
    context.response.headers.set("Location", "/calendarioEntrevistador");
}