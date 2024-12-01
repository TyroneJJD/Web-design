const cambiarFotoBackgroundBtn = document.getElementById('cambiar_background_btn');
const cambiarFotoPerfilBtn = document.getElementById('cambiar_perfil_btn');

const GuardarBtn = document.getElementById("guardar_btn");

const backgroundInput = document.getElementById('backgroung_img');
const perfilInput = document.getElementById('perfil_img');

const elementoConBackground = document.getElementById('contenedor_foto');
const elementoFoto = document.getElementById('foto_perfil');

const regex = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w-./?%&=#]+)?$/;

var imagenBackground = "";
var imagenPerfil = "";


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
        console.log("Si")

        const infoPerfil = {};
        let links = [];

        infoPerfil.rol = document.getElementById('rol').value;
        infoPerfil.sobreMi = document.getElementById('sobre_mi').value;

        document.querySelectorAll('red_social').forEach(input => {
        links.push(input.value);
        });

        infoPerfil.links = links;
        infoPerfil.imagenPerfil = imagenPerfil;
        infoPerfil.imagenBackground = imagenBackground;

    }else{
        console.log("No")
    }

});

function EsInfoValida(){

    return (EsRolValido() && EsDescripcionValida() && SonLinksValidos() && EsImagenValida(imagenBackground) && EsImagenValida(imagenPerfil));

}

function EsRolValido(){
    console.log("EsRol")

    let texto = document.getElementById("rol").value.trim();
    

    if(texto.length > 20){
        return false;
    }

    console.log("EsRol")
    return (texto !== "");
}    

function EsDescripcionValida(){
    console.log("EsDesc")

    let texto = document.getElementById("sobre_mi").value.trim();

    if(texto.length > 150){
        return false;
    }

    console.log("EsDesc")

    return texto !== "";
}    

function SonLinksValidos(){

    let result = true;
    
    document.querySelectorAll('.red_social').forEach(input => {
        if(input.value !== ""){
            try{
                let A = new URL(input.value.trim());
                console.log(A)
            } catch (e) {
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

    console.log("EsImagenb")


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

}

function CargaFotoBackGround(){

}