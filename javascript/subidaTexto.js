// Inicializa el editor Quill
const quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Escribe el contenido aquí...",
  modules: { toolbar: true },
});

// Función para enviar la publicación
async function guardarPublicacion(event) {
  event.preventDefault(); // Evita el envío directo del formulario

  // Actualiza el campo oculto con el contenido de Quill
  const contenido = quill.root.innerHTML; // Obtiene el contenido en formato HTML
  document.getElementById("contenido").value = contenido;

  // Crea un FormData a partir del formulario
  const form = document.getElementById("postForm");
  const formData = new FormData(form);

  try {
    // Enviar la publicación al servidor
    const response = await fetch("/save-content", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Publicación guardada exitosamente. ID:", result.id);
    } else {
      console.error("Error al guardar la publicación:", result.message);
    }
  } catch (error) {
    console.error("Error al enviar la publicación:", error);
  }
}

// Asigna el evento de guardado al formulario
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", guardarPublicacion);
});