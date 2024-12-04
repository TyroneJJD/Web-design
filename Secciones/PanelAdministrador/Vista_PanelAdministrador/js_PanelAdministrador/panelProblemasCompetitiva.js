
//Esta funcion es muy importante
function buscarProblema() {
  const inputBuscar = document.getElementById("buscarProblema");
  const query = inputBuscar.value.trim();

  if (query) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/AdminPanel_ProblemasCompetitivaEspecifico/?nombreProblema=${encodeURIComponent(query)}`;
  } else {
    alert("Por favor, ingresa un término para buscar.");
  }
}

function eliminarProblema(idProblema) {
  const query = idProblema;

  if (query) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/AdminPanel_EliminarProblemasCompetitiva/?idProblema=${encodeURIComponent(query)}`;
  } else {
    alert("Por favor, ingresa un término para buscar.");
  }
}

function agregarProblema(){
  const nombre = document.getElementById("nombre-problema-agregar").value;
  const plataforma = document.getElementById("plataforma-agregar").value;
  const dificultad = document.getElementById("dificultad-agregar").value;
  const categorias = document.querySelectorAll(".categoria-agregar");
  const categoriasSeleccionadas = [];
  categorias.forEach((categoria) => {
    if (categoria.querySelector("input[type='checkbox']").checked) {
      categoriasSeleccionadas.push(categoria.querySelector("input[type='checkbox']").value);
    }
  });
  const link = document.getElementById("link-problema-agregar").value;

  console.log(nombre, plataforma, dificultad, categoriasSeleccionadas, link);
  if (nombre && plataforma && dificultad && categoriasSeleccionadas.length && link) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/AdminPanel_AgregarProblemasCompetitiva/?nombre=${encodeURIComponent(nombre)}&plataforma=${encodeURIComponent(plataforma)}&dificultad=${encodeURIComponent(dificultad)}&categorias=${encodeURIComponent(categoriasSeleccionadas.join(","))}&link=${encodeURIComponent(link)}`;
  } else {
    alert("Por favor, llena todos los campos.");
  }
}

// Logica abrir modal de agregar problema

const btnAgregarProblemaModal = document.querySelector(".agregar-problema");
const modalAgregarProblema = document.getElementById("modal-agregar-problema");
const CerrarModal = document.getElementById("cerrar-modal-agregar-problema");
const CancelarModal = document.getElementById("cancelar-agregar-problema");

btnAgregarProblemaModal.addEventListener("click", () => {
console.log("click");
modalAgregarProblema.style.display = "flex";

});

CerrarModal.addEventListener("click", () => {
modalAgregarProblema.style.display = "none";
});

CancelarModal.addEventListener("click", () => {
modalAgregarProblema.style.display = "none";
});

const btnModificarProblemaModal = document.querySelectorAll(".problema");

btnModificarProblemaModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    const problemaID = btn.getAttribute("data-id");
    const modalModificarProblema = document.getElementById("modal-modificar-problema-"+problemaID);
    const CerrarModalModificar = document.getElementById("cerrar-modal-modificar-problema-"+problemaID);
    const CancelarModalModificar = document.getElementById("cancelar-modificar-problema-"+problemaID);

    modalModificarProblema.style.display = "flex";

    CerrarModalModificar.addEventListener("click", () => {
      modalModificarProblema.style.display = "none";
    });

    CancelarModalModificar.addEventListener("click", () => {
      modalModificarProblema.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == modalModificarProblema) {
        modalModificarProblema.style.display = "none";
      }
    };
  });
});

// // cerrar al presionar fuera
// window.onclick = function (event) {
//   if (event.target == modalAgregarProblema) {
//     modalAgregarProblema.style.display = "none";
//   }
//   else if (event.target == modalModificarProblema) {
//     modalModificarProblema.style.display = "none";
//   }
// };


document.querySelectorAll('.categoria').forEach(categoria => {
categoria.addEventListener('click', (event) => {
    // Prevenir interferencias si el clic fue directamente en el input o label
    if (event.target.tagName !== 'INPUT' || event.target.tagName !== 'LABEL') {
        const checkbox = categoria.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
    }
});
});

document.querySelectorAll('.categoria-agregar').forEach(categoria => {
  categoria.addEventListener('click', (event) => {
      // Prevenir interferencias si el clic fue directamente en el input o label
      if (event.target.tagName !== 'INPUT' || event.target.tagName !== 'LABEL') {
          const checkbox = categoria.querySelector('input[type="checkbox"]');
          checkbox.checked = !checkbox.checked;
      }
  });
  });

function modificarProblema(idProblema) {
  const nombre = document.getElementById("nombre-problema-"+idProblema).value;
  const plataforma = document.getElementById("plataforma-"+idProblema).value;
  const dificultad = document.getElementById("dificultad-"+idProblema).value;
  const categorias = document.querySelectorAll(`.categoria[data-id="${idProblema}"] input[type="checkbox"]`);
  const categoriasSeleccionadas = [];
  categorias.forEach((categoria) => {
    if (categoria.checked) {
      categoriasSeleccionadas.push(categoria.value);
    }
  });
  const link = document.getElementById("link-problema-"+idProblema).value;

  console.log(idProblema, nombre, plataforma, dificultad, categoriasSeleccionadas, link);

  if (idProblema && nombre && plataforma && dificultad && categoriasSeleccionadas.length && link) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/AdminPanel_ModificarProblemasCompetitiva/?idProblema=${encodeURIComponent(idProblema)}&nombre=${encodeURIComponent(nombre)}&plataforma=${encodeURIComponent(plataforma)}&dificultad=${encodeURIComponent(dificultad)}&categorias=${encodeURIComponent(categoriasSeleccionadas.join(","))}&link=${encodeURIComponent(link)}`;
  } else {
    alert("Por favor, llena todos los campos.");
  }
}