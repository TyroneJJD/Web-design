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

const horarios = document.querySelectorAll('.horario');
const modalcita = document.getElementById('modal-cita');
const closeModalCita = document.getElementById('cerrar-modal-cita');
const cancelModalCita = document.getElementById('cancelar-cita');

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

// Logica para modal de agregar horario

const agregarHorario = document.querySelectorAll('.agregar-horario');
const modalAgregarHorario = document.getElementById('modal-horas');
const closeModalAgregarHorario = document.getElementById('cerrar-modal-horas');
const cancelModalAgregarHorario = document.getElementById('cancelar-horas');

// Abrir modal al seleccionar horario
agregarHorario.forEach(horario => {
    horario.addEventListener('click', () => {
        modalAgregarHorario.style.display = 'flex';
    });
});

// Cerrar modal
closeModalAgregarHorario.addEventListener('click', () => {
    modalAgregarHorario.style.display = 'none';
});

cancelModalAgregarHorario.addEventListener('click', () => {
    modalAgregarHorario.style.display = 'none';
});

// Opcional: Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modalAgregarHorario) {
        modalAgregarHorario.style.display = 'none';
    }
});

document.querySelectorAll('.solicitud').forEach((solicitud) => {
    solicitud.addEventListener('click', (e) => {
        const input = solicitud.querySelector('input[type="radio"]');
        input.checked = true;
    });
});

//--------------------------------------------------------------------

const listaSolicitudes = document.querySelector('.lista-solicitudes');

// Manejar clic en horario para mostrar detalles de los candidatos
horarios.forEach(horario => {
    horario.addEventListener('click', (e) => {
        // Obtener los datos relacionados al horario (puedes usar atributos data-* para pasar información)
        const reuniones = e.currentTarget.dataset.reuniones 
            ? JSON.parse(e.currentTarget.dataset.reuniones) 
            : [];

        // Limpiar contenido anterior
        listaSolicitudes.innerHTML = '';

        // Generar contenido dinámico
        if (reuniones.length > 0) {
            reuniones.forEach(reunion => {
                reunion.candidatosRegistrados.forEach(candidato => {
                    const solicitudDiv = document.createElement('div');
                    solicitudDiv.classList.add('solicitud');
                    solicitudDiv.innerHTML = `
                        <div class="info-candidato">
                            <p><strong>Nombre Candidato:</strong> ${candidato.nombreCandidato}</p>
                            <p><strong>Tipo de reuinion:</strong> ${candidato.tipoDeReuinion}</p>
                            <p><strong>Motivo de la reunion:</strong> ${candidato.motivoDeLaReunion}</p>
                            <p><strong>Comentarios Adicionales:</strong> ${candidato.comentariosAdicionales}</p>
                            <p><strong>Link Resume:</strong> ${candidato.linkResume}</p>
                        </div>
                        <input type="radio" name="candidato-seleccionado" value="${candidato.id}">
                    `;
                    listaSolicitudes.appendChild(solicitudDiv);
                });
            });
        } else {
            listaSolicitudes.innerHTML = '<p>No hay solicitudes para este horario.</p>';
        }

        // Mostrar el modal
        modalcita.style.display = 'flex';
    });
});
