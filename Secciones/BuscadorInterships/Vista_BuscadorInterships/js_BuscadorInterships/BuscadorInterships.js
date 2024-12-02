function buscarInterships() {
    const inputBuscar = document.getElementById("buscarProblema");
    const query = inputBuscar.value.trim();
  
    if (query) {
      globalThis.location.href = `/BuscadorIntershipsV2Especifico?nombreCompania=${encodeURIComponent(query)}`;
    } else {
      alert("Por favor, ingresa un término para buscar.");
    }
  }
  