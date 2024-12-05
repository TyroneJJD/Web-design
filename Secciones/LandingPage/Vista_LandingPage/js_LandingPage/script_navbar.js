document.addEventListener("DOMContentLoaded", () => {
  const botonMenu = document.querySelector(".menu-toggle");
  const enlacesNav = document.querySelector(".nav-links");

  // Alterna la clase "activo" para mostrar u ocultar el menú
  botonMenu.addEventListener("click", () => {
      enlacesNav.classList.toggle("activo");
  });
});
