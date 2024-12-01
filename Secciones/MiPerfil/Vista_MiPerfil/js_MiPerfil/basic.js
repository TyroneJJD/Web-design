// Obtiene los elementos necesarios
const modal = document.getElementById("modal");
const abrirModal = document.getElementById("abrir-modal");
const cerrarModal = document.getElementById("cerrar-modal");
const home = document.getElementById("home");

// Selecciona los enlaces del menú y el contenedor principal
const links = document.querySelectorAll('nav .link_pagina');
const mainContent = document.getElementById('main-content');


home.addEventListener("click", (e) => {
    var str = "<h1>Bienvenido</h1><p>Selecciona una página del menú para cargar contenido aquí.</p>"
    mainContent.innerHTML = str;   
});


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



