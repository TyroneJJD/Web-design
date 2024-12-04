const cambiarFotoBackgroundBtn = document.getElementById('cambiar_background_btn');
const cambiarFotoPerfilBtn = document.getElementById('cambiar_perfil_btn');

const GuardarBtn = document.getElementById("guardar_btn");
const CancelarBtn = document.getElementById("cancelar_btn");


const backgroundInput = document.getElementById('backgroung_img');
const perfilInput = document.getElementById('perfil_img');

const elementoConBackground = document.getElementById('contenedor_foto');
const elementoFoto = document.getElementById('foto_perfil');

const imagenBackgroundInicial = CargaFotoBackGround();
const imagenPerfilInicial = CargaFotoPerfil();

console.log(imagenBackgroundInicial);
console.log(imagenPerfilInicial);

let imagenBackground = imagenBackgroundInicial;
let imagenPerfil = imagenPerfilInicial;

document.addEventListener('DOMContentLoaded', () => {

});

cambiarFotoBackgroundBtn.addEventListener('click', () => {
  backgroundInput.click();
});

cambiarFotoPerfilBtn.addEventListener('click', () => {
    perfilInput.click();
});

backgroundInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
        const reader = new FileReader();

        // Cuando el archivo se cargue, asigna su contenido
        reader.onload = function (e) {
            const imageSrc = e.target.result; // Contiene la URL de la imagen

            // Asigna la imagen como fondo de un <div>
            elementoConBackground.style.backgroundImage = `url(${imageSrc})`;

            imagenBackground = {
                imageUrl: imageSrc,       // Base64 de la imagen
                fileName: file.name,      // Nombre del archivo
                fileSize: file.size,      // Tamaño del archivo en bytes
            };
        };

        // Lee el archivo como una URL de datos
        reader.readAsDataURL(file);
    }
});

perfilInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
        const reader = new FileReader();

        // Cuando el archivo se cargue, asigna su contenido
        reader.onload = function (e) {
            const imageSrc = e.target.result; // Contiene la URL de la imagen
            elementoFoto.src = imageSrc;

            imagenPerfil = {
                imageUrl: imageSrc,       // Base64 de la imagen
                fileName: file.name,      // Nombre del archivo
                fileSize: file.size,      // Tamaño del archivo en bytes
            };
        };

        // Lee el archivo como una URL de datos
        reader.readAsDataURL(file);
    }
});

GuardarBtn.addEventListener("click",() => {

    if(EsInfoValida()){

        const infoPerfil = {};
        const infoCampos = {};
        const infoImagenes = {};

        infoCampos.titularUsuario = document.getElementById('rol').value;
        infoCampos.descripcionUsuario = document.getElementById('sobre_mi').value;

        infoCampos.linkLinkedin = document.getElementById('linkLinkendin').value;
        infoCampos.linkGithub = document.getElementById('linkGithub').value;
        infoCampos.linkPortafolioPersonal = document.getElementById('linkPortafolioPersonal').value;

        infoPerfil.infoCampos = infoCampos;

        if(imagenPerfil !== imagenPerfilInicial){
            infoImagenes.imagenPerfil = imagenPerfil;
        }else{
            infoImagenes.imagenPerfil = {fileName:"",base64:""};
        }

        if(imagenBackground !== imagenBackgroundInicial){
            infoImagenes.imagenBackground = imagenBackground;
        }else{
            infoImagenes.imagenBackground = {fileName:"",base64:""};;
        }

        infoPerfil.infoImagenes = infoImagenes;

        EnviaDatosGuardados(infoPerfil);

    }
});

CancelarBtn.addEventListener("click", ()=>{

});

function EsInfoValida(){

    return (EsRolValido() && EsDescripcionValida() && SonLinksValidos() && EsImagenValida(imagenBackground) && EsImagenValida(imagenPerfil));

}

function EsRolValido(){

    if(document.getElementById("rol").value.trim().length > 20){
        return false;
    }

    return (texto !== "");
}    

function EsDescripcionValida(){

    if(document.getElementById("sobre_mi").value.trim().length > 150){
        return false;
    }

    return texto !== "";
}    

function SonLinksValidos(){

    let result = true;
    
    document.querySelectorAll('.red_social').forEach(input => {
        if(input.value !== ""){
            try{
                new URL(input.value.trim());
            } catch {
                result = false;
                input.focus();
            }
        }
    });

    console.log("EsLink")
    console.log(result)

    return result;
} 

function EsImagenValida(img){

    if(img === ""){
        return true;
    }

    if (!img || Object.keys(img).length === 0) {
        return false;
    }

    // Validar que el objeto esté completo
    if (!img.imageUrl || !img.fileName || !img.fileSize) {
        return false;
    }

    if (img.imageUrl == "" || img.fileName == "" || img.fileSize <= 0 ) {
        return false;
    }

    // Validar que la URL sea de una imagen
    if (!img.imageUrl.startsWith('data:image')) {
        return false;
    }

    if (!(img &&
        typeof img.imageUrl === 'string' &&
        typeof img.fileName === 'string' &&
        typeof img.fileSize === 'number')) {
      return true;
    }

    return true;
}

function CargaFotoPerfil(){
    return elementoFoto.src;
}

function CargaFotoBackGround(){
    return getComputedStyle(elementoConBackground).backgroundImage.slice(5,-2);
}

function EnviaDatosGuardados(infoPerfil){
    fetch('/editarDatosPerfil', {
        method: 'POST', // Método HTTP
        headers: {
            'Content-Type': 'application/json', // Tipo de contenido
        },
        body: JSON.stringify(infoPerfil), // Convertir el objeto a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json(); // Parsear la respuesta JSON
        })
        .then(result => {
            console.log("Respuesta del servidor:", result);
        })
        .catch(error => {
            console.error("Ocurrió un error:", error);
        });
}