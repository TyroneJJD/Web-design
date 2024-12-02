function moverASeccionServicios(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.getElementById("formularioContacto").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Gracias por tu mensaje. Nos pondremos en contacto contigo lo antes posible.");
    e.target.reset();
});
