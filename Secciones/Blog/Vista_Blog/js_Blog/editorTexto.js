const quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Escribe el contenido aquí...",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"], // Formatos básicos
      [{ list: "ordered" }, { list: "bullet" }], // Listas
      ["blockquote", "code-block"], // Citas y bloques de código
      [{ script: "sub" }, { script: "super" }], // Superíndice y subíndice
      [{ color: [] }, { background: [] }], // Colores de texto y fondo
      [{ align: [] }], // Alineación
      ["link", "image"] // Links, imágenes, videos
    ],
    syntax: true, // Activar resaltado de sintaxis
  },
});

function guardarPublicacion(event) {
  event.preventDefault();

  const contenido = quill.root.innerHTML;
  document.getElementById("contenido").value = contenido;

  const form = document.getElementById("postForm");
  const formData = new FormData(form);

  try {
    fetch("/save-content", {
      method: "POST",
      body: formData,
    });

    console.log("Publicación enviada correctamente");
    globalThis.location.href = "/";
  } catch (error) {
    console.error("Error al enviar la publicación:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", guardarPublicacion);
});