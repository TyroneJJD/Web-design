const manejadorUsuario = new ManejadorUsuario();
const nuevoUsuario: Omit<IUsuario, "_id"> = {
  nombreUsuario: "juanperez",
  correoElectronicoUsuario: "juanperez@example.com",
  contraseniaUsuario: "contraseña123",
  fechaNacimientoUsuario: new Date("1990-01-01"),
  universidadUsuario: "Universidad Nacional",
  carreraUniversitariaUsuario: "Ingeniería de Sistemas",
  esAdministrador: true,
  esCoach: false,
  puedePublicarEnElBlog: true,
  puedePublicarProblemas: false,
};

try {
  const usuarioCreado = await manejadorUsuario.crearNuevoUsuario(nuevoUsuario);
  console.log("Usuario creado con éxito:", usuarioCreado);
} catch (error) {
  console.error("Error al crear el usuario:", error);
}