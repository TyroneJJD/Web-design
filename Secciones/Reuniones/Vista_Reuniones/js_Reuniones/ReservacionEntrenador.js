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

// Obtener referencias a los elementos
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Agregar un event listener al botón de hamburguesa
menuToggle.addEventListener('click', () => {
  // Alternar la clase 'active' en el menú
  navMenu.classList.toggle('active');
});

// Logica para modal de horario default

// Obtener los id de las reuniones
const elementos = document.querySelectorAll('.horario[data-id]');
elementos.forEach(elemento => {
    console.log(elemento.getAttribute('data-id'));
    
const horarios = document.querySelectorAll('.horario[data-id="'+elemento.getAttribute('data-id')+'"]');
const modalcita = document.getElementById('modal-cita-'+elemento.getAttribute('data-id'));
const closeModalCita = document.getElementById('cerrar-modal-cita-'+elemento.getAttribute('data-id'));
const cancelModalCita = document.getElementById('cancelar-cita-'+elemento.getAttribute('data-id'));

// Abrir modal al seleccionar horario
horarios.forEach(horario => {
    horario.addEventListener('click', () => {
        modalcita.style.display = 'flex';
    });
});

// Cerrar modal
closeModalCita.addEventListener('click', () => {
    modalcita.style.display = 'none';
});

cancelModalCita.addEventListener('click', () => {
    modalcita.style.display = 'none';
});

// Opcional: Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modalcita) {
        modalcita.style.display = 'none';
    }
});

});
// Logica para modal de horario pendiente

const horariosPendientes = document.querySelectorAll('.horario_pendiente');
const modalcitaPendiente = document.getElementById('modal-cita-pendiente');
const closeModalCitaPendiente = document.getElementById('cerrar-modal-cita-pendiente');
const cancelModalCitaPendiente = document.getElementById('cancelar-cita-pendiente');

// Abrir modal al seleccionar horario
horariosPendientes.forEach(horario => {
    horario.addEventListener('click', () => {
        modalcitaPendiente.style.display = 'flex';
    });
});

// Cerrar modal
closeModalCitaPendiente.addEventListener('click', () => {
    modalcitaPendiente.style.display = 'none';
});

cancelModalCitaPendiente.addEventListener('click', () => {
    modalcitaPendiente.style.display = 'none';
});

// Opcional: Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modalcitaPendiente) {
        modalcitaPendiente.style.display = 'none';
    }
});

// Logica para modal de horario confirmado

const horariosConfirmados = document.querySelectorAll('.horario_confirmado');
const modalcitaConfirmada = document.getElementById('modal-cita-confirmado');
const closeModalCitaConfirmada = document.getElementById('cerrar-modal-cita-confirmado');
const cancelModalCitaConfirmada = document.getElementById('cancelar-cita-confirmado');

// Abrir modal al seleccionar horario
horariosConfirmados.forEach(horario => {
    horario.addEventListener('click', () => {
        modalcitaConfirmada.style.display = 'flex';
    });
});

// Cerrar modal
closeModalCitaConfirmada.addEventListener('click', () => {
    modalcitaConfirmada.style.display = 'none';
});

cancelModalCitaConfirmada.addEventListener('click', () => {
    modalcitaConfirmada.style.display = 'none';
});

// Opcional: Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modalcitaConfirmada) {
        modalcitaConfirmada.style.display = 'none';
    }
});

// Logica para modal de horario ocupado

const horariosOcupados = document.querySelectorAll('.horario_ocupado');
const modalcitaOcupada = document.getElementById('modal-cita-ocupado');
const closeModalCitaOcupada = document.getElementById('cerrar-modal-cita-ocupado');
const cancelModalCitaOcupada = document.getElementById('cancelar-cita-ocupado');

// Abrir modal al seleccionar horario
horariosOcupados.forEach(horario => {
    horario.addEventListener('click', () => {
        modalcitaOcupada.style.display = 'flex';
    });
});

// Cerrar modal
closeModalCitaOcupada.addEventListener('click', () => {
    modalcitaOcupada.style.display = 'none';
});

cancelModalCitaOcupada.addEventListener('click', () => {
    modalcitaOcupada.style.display = 'none';
});

// Opcional: Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modalcitaOcupada) {
        modalcitaOcupada.style.display = 'none';
    }
});
