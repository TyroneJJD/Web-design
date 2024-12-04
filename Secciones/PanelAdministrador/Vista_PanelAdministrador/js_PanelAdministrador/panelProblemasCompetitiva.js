//Esta funcion es muy importante
function buscarProblema() {
  const inputBuscar = document.getElementById("buscarProblema");
  const query = inputBuscar.value.trim();

  if (query) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/PruebaEspecifico/?nombreProblema=${encodeURIComponent(query)}`;
  } else {
    alert("Por favor, ingresa un término para buscar.");
  }
}

function eliminarProblema() {
  const inputEliminar = document.getElementById("id-problema");
  const query = inputEliminar.value.trim();

  if (query) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/EliminarProblema/?idProblema=${encodeURIComponent(query)}`;
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
    globalThis.location.href = `/AgregarProblema/?nombre=${encodeURIComponent(nombre)}&plataforma=${encodeURIComponent(plataforma)}&dificultad=${encodeURIComponent(dificultad)}&categorias=${encodeURIComponent(categoriasSeleccionadas.join(","))}&link=${encodeURIComponent(link)}`;
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

// cerrar al presionar fuera
window.onclick = function (event) {
  if (event.target == modalAgregarProblema) {
    modalAgregarProblema.style.display = "none";
  }
  else if (event.target == modalModificarProblema) {
    modalModificarProblema.style.display = "none";
  }
};


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

const btnModificarProblema = document.querySelector(".problema");
const modalModificarProblema = document.getElementById("modal-modificar-problema");
const CerrarModalModificar = document.getElementById("cerrar-modal-modificar-problema");
const CancelarModalModificar = document.getElementById("cancelar-modificar-problema");

btnModificarProblema.addEventListener("click", () => {
modalModificarProblema.style.display = "flex";
});

CerrarModalModificar.addEventListener("click", () => {
modalModificarProblema.style.display = "none";
});

CancelarModalModificar.addEventListener("click", () => {
modalModificarProblema.style.display = "none";
});

function modificarProblema(){
  const idProblema = document.getElementById("id-problema").value;
  const nombre = document.getElementById("nombre-problema").value;
  const plataforma = document.getElementById("plataforma").value;
  const dificultad = document.getElementById("dificultad").value;
  const categorias = document.querySelectorAll(".categoria");
  const categoriasSeleccionadas = [];
  categorias.forEach((categoria) => {
    if (categoria.querySelector("input[type='checkbox']").checked) {
      categoriasSeleccionadas.push(categoria.querySelector("input[type='checkbox']").value);
    }
  });
  const link = document.getElementById("link-problema").value;

  if (idProblema && nombre && plataforma && dificultad && categoriasSeleccionadas.length && link) {
    // Redirigir a la URL con el parámetro de consulta
    globalThis.location.href = `/ModificarProblema/?idProblema=${encodeURIComponent(idProblema)}&nombre=${encodeURIComponent(nombre)}&plataforma=${encodeURIComponent(plataforma)}&dificultad=${encodeURIComponent(dificultad)}&categorias=${encodeURIComponent(categoriasSeleccionadas.join(","))}&link=${encodeURIComponent(link)}`;
  } else {
    alert("Por favor, llena todos los campos.");
  }
}