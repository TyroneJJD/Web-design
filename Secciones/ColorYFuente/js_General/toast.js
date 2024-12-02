// Función para mostrar el toast
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) {
    console.error("El contenedor para los toasts no existe.");
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  if (type === "error") toast.style.backgroundColor = "#ff4d4d";
  if (type === "success") toast.style.backgroundColor = "#4caf50";
  if (type === "warning") toast.style.backgroundColor = "#ffc107";
  if (type === "info") toast.style.backgroundColor = "#2196f3";

  const closeButton = document.createElement("span");
  closeButton.className = "toast-close";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => toast.remove();

  toast.appendChild(closeButton);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fade-out 0.5s forwards";
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// Leer la cookie y mostrar el toast
function checkToastFromCookie() {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key.trim()] = value ? decodeURIComponent(value.trim()) : "";
    return acc;
  }, {});

  const toastData = cookies.toast ? JSON.parse(cookies.toast) : null;

  if (toastData) {
    showToast(toastData.message, toastData.type);

    // Eliminar la cookie después de usarla
    document.cookie = "toast=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", checkToastFromCookie);
