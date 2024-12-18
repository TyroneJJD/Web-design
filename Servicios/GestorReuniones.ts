import { GoogleApis } from "npm:googleapis";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { BaseDeDatosMongoDB } from "./BaseDeDatos/BaseDeDatos.ts";
import { ISesionEntrevista } from "./BaseDeDatos/Entrevistas.ts";
import { ObjectId } from "npm:mongodb";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { ManejadorCorreoElectronico} from "./CorreoElectronico/ManejadorCorreoElectronico.ts";
import { IUsuario } from "./BaseDeDatos/DatosUsuario.ts";


// <!!!!!----------!!!!!> ZONA DE GUERRA

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
  const datos = await context.request.body().value;

  const url = datos.urlActual;
  const parsedUrl = new URL(url);
  const code = parsedUrl.searchParams.get("code");

  const idDeLaReunion = datos.idReunion;

  const db = BaseDeDatosMongoDB.obtenerInstancia();
  const refColeccion = db.obtenerReferenciaColeccion<ISesionEntrevista>(
    "Reuniones"
  ) as unknown as Collection<ISesionEntrevista>;

  const archivoDeLaReunion = await refColeccion.findOne({
    _id: new ObjectId(idDeLaReunion),
  });

  console.log("Reunión encontrada:", archivoDeLaReunion);
  const env = config();

  if (!code) {
    context.response.status = 400;
    context.response.body = "Falta el código de autorización.";

    return;
  }

  const googleApis = new GoogleApis();
  const auth = new googleApis.auth.OAuth2(
    env.CLIENT_ID,
    env.CLIENT_SECRET,
    env.REDIRECT_URI
  );

  const { tokens } = await auth.getToken(code);
  auth.setCredentials(tokens);

  // Crear un evento en Google Calendar con Google Meet
  const calendar = googleApis.calendar({ version: "v3", auth });
  const event = {
    summary: "Reunion de prueba",
    description: "Descripción de la reunión de prueba.",
    start: {
      dateTime: archivoDeLaReunion?.horaInicio?.toISOString(),
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: archivoDeLaReunion?.horaFin?.toISOString(),
      timeZone: "America/Mexico_City",
    },
    conferenceData: {
      createRequest: {
        requestId: "some-random-string",
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    attendees: [],
    reminders: {
      useDefault: false, // Deshabilitar recordatorios predeterminados
      overrides: [
        { method: "email", minutes: 24 * 60 }, // Recordatorio por correo, 24 horas antes
        { method: "popup", minutes: 10 }, // Recordatorio emergente, 10 minutos antes
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
  });
  const datosDelEntrevistador = await obtenerUsuarioPorId(archivoDeLaReunion?.idCoach as string);
  const datosDelEntrevistado = await obtenerUsuarioPorId(archivoDeLaReunion?.candidatoSeleccionadoAEntrevistar.idCandidatoRegistrado as string);
  
  const manejadorCorreoElectronico = new ManejadorCorreoElectronico();
  if (response.data.hangoutLink) {
    manejadorCorreoElectronico.enviarCorreoNuevaReunionParaEntrevistador(datosDelEntrevistador.correoElectronicoInstitucionalUsuario, datosDelEntrevistador.nombreUsuario + datosDelEntrevistador.apellidoUsuario, response.data.hangoutLink);
    manejadorCorreoElectronico.enviarCorreoNuevaReunionParaEntrevistado(datosDelEntrevistado.correoElectronicoInstitucionalUsuario, datosDelEntrevistado.nombreUsuario + datosDelEntrevistado.apellidoUsuario, response.data.hangoutLink);
  } else {
    console.error("Error: hangoutLink is undefined");
  }

  context.response.status = 302; // Redirección temporal
  context.response.headers.set("Location", "/calendarioEntrevistador");
}

 async function obtenerUsuarioPorId(id: string): Promise<IUsuario> {
  const db = BaseDeDatosMongoDB.obtenerInstancia();
  const collection = db.obtenerReferenciaColeccion<IUsuario>(
    "Usuarios"
  ) as unknown as Collection<IUsuario>;

  const usuario = await collection.findOne({ _id: new ObjectId(id) });
  if (!usuario) {
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }
  return usuario;
}
