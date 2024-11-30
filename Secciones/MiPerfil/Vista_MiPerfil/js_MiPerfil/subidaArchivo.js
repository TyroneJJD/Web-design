const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("file");
const dropText = document.getElementById("dropText");
const uploadButton = document.getElementById("uploadButton");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");

  if (event.dataTransfer.files.length) {
    fileInput.files = event.dataTransfer.files;
    uploadButton.disabled = false; // Habilita el botón de enviar
    dropZone.classList.add("file-selected"); // Aplica el estilo de archivo cargado
    dropText.innerHTML =
      "Archivo recibido: " + event.dataTransfer.files[0].name; // Muestra el mensaje
  }
});

fileInput.addEventListener("change", () => {
  uploadButton.disabled = !fileInput.files.length; // Habilita o deshabilita según el archivo
  if (fileInput.files.length) {
    dropZone.classList.add("file-selected"); // Aplica el estilo de archivo cargado
    dropText.innerHTML = "Archivo recibido: " + fileInput.files[0].name; // Muestra el mensaje
  } else {
    dropZone.classList.remove("file-selected"); // Restaura el estilo original si se quita el archivo
    dropText.innerHTML =
      "Arrastra y suelta el archivo aquí<br>o haz clic para seleccionarlo"; // Mensaje original
  }
});