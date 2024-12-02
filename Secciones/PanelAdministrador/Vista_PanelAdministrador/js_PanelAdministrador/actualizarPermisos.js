document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", async (event) => {
        // Extraer el ID del usuario del ID del checkbox
        const idUsuario = event.target.id.split("_")[1]; 
        
        // Determinar el permiso basado en el ID del checkbox
        const permiso = event.target.id.includes("blog") 
            ? "puedePublicarEnElBlog"
            : event.target.id.includes("problemas")
            ? "puedePublicarProblemas"
            : event.target.id.includes("coach")
            ? "esCoach"
            : event.target.id.includes("administrador")
            ? "esAdministrador"
            : null;

        // Validar si el permiso fue encontrado
        if (!permiso) {
            console.error("Permiso no válido encontrado");
            return;  // Si no se encuentra el permiso, salimos de la función
        }

        // Obtener el estado del checkbox (checked o unchecked)
        const estado = event.target.checked;

        // Crear el objeto con todos los datos a enviar en el cuerpo de la solicitud
        const data = {
            idUsuario,   // El ID del usuario
            permiso,     // El permiso que se está modificando
            estado,      // El nuevo estado (checked o unchecked)
        };

        // Realizar la solicitud a la API para actualizar el permiso
        await fetch(`/api/actualizar-permisos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),  // Enviar todos los datos en el body
        });
    });
});
