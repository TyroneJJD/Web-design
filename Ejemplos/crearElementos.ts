
import { PeticionesAdministrador } from "../BaseDatos/peticionesAdministrador.ts";

const admin= new PeticionesAdministrador();


await admin.crearNuevoEntrevistador({
  nombreEntrevistador: "Basto",
  correoElectronicoEntrevistador: "correo@fmat.com",
  afiliacionEntrevistador: "Fmat",
});

await admin.crearNuevoEntrevistado({
  nombreEntrevistado: "Pablo",
  correoElectronicoEntrevistado: "pabloten56@hotmail.com",
  semestreCarreraUniversitariaEntrevistado: 2,
  carreraUniversitariaEntrevistado: "LIS",
  contrasenia: "1234",
});