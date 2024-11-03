import { PeticionesEntrevistado } from "../BaseDatos/peticionesEntrevistado.ts";
import { PeticionesEntrevistador } from "../BaseDatos/peticionesEntrevistador.ts";
import { Agenda } from "../Modelo/Agenda.ts";

const Basto = new PeticionesEntrevistador();
const Pablo = new PeticionesEntrevistado();

const IdBasto = await Pablo.buscarIdEntrevistador("Basto", "correo@fmat.com");
const datosPablo = await Pablo.buscarDatosEntrevistado(
  "Pablo",
  "pabloten56@hotmail.com"
);

const disponibilidadEntrevistador = new Agenda({
  dia: 27,
  mes: 12,
  anio: 2024,
  horaInicioDisponibilidad: 10,
  minutoInicioDisponibilidad: 15,
  horaFinDisponibilidad: 13,
  minutoFinDisponibilidad: 20,
});

if (IdBasto) {
  const sesionesEntrevista =
    await disponibilidadEntrevistador.obtenerSesionesDeEntrevista();
  sesionesEntrevista.forEach((entrevista) => {
    Basto.agregarSesionAlCalendario(IdBasto, entrevista);
  });
} else {
  throw new Error("ID del entrevistador no definido");
}

if (IdBasto) {
  const calendarioBasto = await Pablo.pedirCalendarioEntrevistador(IdBasto);
  console.log(calendarioBasto);
} else {
  throw new Error("ID del entrevistador no definido");
}

if (datosPablo) {
  await Pablo.inscribirmeASesion(
    IdBasto,
    "TI - CO - XC",
    datosPablo.nombreEntrevistado,
    datosPablo.correoElectronicoEntrevistado
  );
  console.log("Inscripción exitosa");
} else {
  throw new Error("Datos del entrevistado no definidos");
}

const calendarioBastoActualizado = await Pablo.pedirCalendarioEntrevistador(
  IdBasto
);
console.log(calendarioBastoActualizado);
