import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { GoogleApis } from "npm:googleapis";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

const app = new Application();
const router = new Router();

// Ruta principal para redirigir al usuario a Google para autorización
router.get("/", (context) => {
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
});

// Ruta para manejar la redirección después de la autorización
router.get("/oauth2callback", async (context) => {
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
    summary: "Reunión Tilina",
    description: "Descripción de la reunión de prueba.",
    start: {
      dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: new Date(new Date().getTime() + 60 * 60 * 2000).toISOString(),
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

  context.response.body = {
    message: "Reunión creada",
    event: response.data,
  };
});

// Configurar servidor y rutas
app.use(router.routes());
app.use(router.allowedMethods());

// Iniciar servidor en puerto 8000
console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });
