//Esta funcion es muy importante
function buscarProblema() {
  const inputBuscar = document.getElementById("buscarProblema");
  const query = inputBuscar.value.trim();

  if (query) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/ProblemasProgramacionCompetitivaEspecifico/?nombreProblema=${encodeURIComponent(query)}`;
  } else {
    alert("Por favor, ingresa un término para buscar.");
  }
}
