// Obtiene los elementos necesarios
const modal = document.getElementById("modal");
const abrirModal = document.getElementById("abrir-modal");
const cerrarModal = document.getElementById("cerrar-modal");

// Muestra el modal al hacer clic en "Avisos"
abrirModal.addEventListener("click", (e) => {
    e.preventDefault(); // Previene el comportamiento del enlace
    modal.style.display = "flex"; // Cambia el display para mostrar el modal
});

// Cierra el modal al hacer clic en la "X"
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cierra el modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Obtener referencias a los elementos
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Agregar un event listener al botón de hamburguesa
menuToggle.addEventListener('click', () => {
  // Alternar la clase 'active' en el menú
  navMenu.classList.toggle('active');
});

