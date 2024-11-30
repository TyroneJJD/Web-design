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


// Agrega un evento a cada enlace para cargar contenido dinámico
links.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault(); // Previene el comportamiento normal del enlace

        // Obtiene el archivo HTML a cargar desde el atributo `data-page`
        const page = link.getAttribute('data-page');

        try {
            // Carga el archivo HTML usando fetch
            const response = await fetch(page);
            if (response.ok) {
                // Reemplaza el contenido de <main> con el contenido del archivo
                const html = await response.text();
                mainContent.innerHTML = html;
            } else {
                mainContent.innerHTML = '<p>Error: No se pudo cargar la página.</p>';
            }
        } catch (error) {
            console.error('Error al cargar la página:', error);
            mainContent.innerHTML = '<p>Error: Ocurrió un problema al cargar la página.</p>';
        }
    });
});
