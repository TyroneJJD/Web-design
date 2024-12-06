const contenedorZonas = document.getElementById("contenedor_zonas");
const zonaCambioBackground = document.getElementById("zona_cambio_background");
const zonaCambioPerfil = document.getElementById("zona_cambio_perfil");

const cambiarBackgroundBtn = document.getElementById("cambiar_background_btn");
const cambiarPerfilBtn = document.getElementById("cambiar_perfil_btn");

const GuardarBtn = document.getElementById("guardar_btn");
const CancelarBtn = document.getElementById("cancelar_btn");

const elementoConBackground = document.getElementById('contenedor_foto');
const elementoFoto = document.getElementById('foto_perfil');

const imagenBackgroundInicial = CargaFotoBackGround();
const imagenPerfilInicial = CargaFotoPerfil();

console.log(imagenBackgroundInicial);
console.log(imagenPerfilInicial);

let imagenBackground = imagenBackgroundInicial;
let imagenPerfil = imagenPerfilInicial;

cambiarBackgroundBtn.addEventListener("click", function() {
    contenedorZonas.style.display = "flex"
    zonaCambioBackground.style.display = "flex"; 
    zonaCambioPerfil.style.display = "none"; 
});

cambiarPerfilBtn.addEventListener("click", function() {
    contenedorZonas.style.display = "flex"
    zonaCambioPerfil.style.display = "flex"; 
    zonaCambioBackground.style.display = "none";
});

zonaCambioBackground.addEventListener("dragover", permitirDrop);
zonaCambioBackground.addEventListener("drop", function (event) {
    manejarDrop(event, "background");
});

zonaCambioPerfil.addEventListener("dragover", permitirDrop);
zonaCambioPerfil.addEventListener("drop", function (event) {
    manejarDrop(event, "perfil");
});

function permitirDrop(event) {
    event.preventDefault(); 
}

window.addEventListener("click", (e) => {
    if (e.target === contenedorZonas) {
        contenedorZonas.style.display = "none"
        zonaCambioBackground.style.display = "none";
    }
    if (e.target === zonaCambioPerfil) {
        contenedorZonas.style.display = "none"
        zonaCambioPerfil.style.display = "none";
    }

});

function manejarDrop(event, tipo) {
    event.preventDefault(); 
    const file = event.dataTransfer.files[0]; 

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageSrc = e.target.result; // Contiene la URL de la imagen

            let imagen = {
                fileName: file.name,      // Nombre del archivo
                base64: imageSrc,         // Base64 de la imagen
            };

            if (tipo === "background") {
                contenedorZonas.style.display = "none"
                zonaCambioBackground.style.display = "none"; 

                elementoConBackground.style.backgroundImage = `url(${imageSrc})`;
                imagenBackground = imagen;
                
            } else if (tipo === "perfil") {
                contenedorZonas.style.display = "none"
                zonaCambioPerfil.style.display = "none"; 

                elementoFoto.src = imageSrc;
                imagenPerfil = imagen;
            }
        };

        reader.readAsDataURL(file);
    }
}


GuardarBtn.addEventListener("click",() => {

    if(EsInfoValida()){

        const infoPerfil = {};
        const infoCampos = {};
        const infoImagenes = {};

        infoCampos.titularUsuario = document.getElementById('rol').value;
        infoCampos.descripcionUsuario = document.getElementById('sobre_mi').value;

        infoCampos.linkLinkendin = document.getElementById('linkLinkendin').value;
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
    window.location.href = "/verMiPerfil";
});

function EsInfoValida(){

    if(!EsRolValido){
        alert("Ingrese correctamente el rol");
        return false;
    }

    if(!EsDescripcionValida()){
        alert("Ingrese correctamente la descripción");
        return false;
    }

    if(!SonLinksValidos()){
        alert("Ingrese correctamente los links");
        return false;
    }

    if( imagenBackground != imagenBackgroundInicial && !EsImagenValida(imagenBackground)){
        alert("Ingrese la imagen de background");
        return false;
    }

    if(imagenPerfil != imagenPerfilInicial && !EsImagenValida(imagenPerfil)){
        alert("Ingrese la imagen de perfil");
        return false;
    }

    return true;

}

function EsRolValido(){

    let texto = document.getElementById("rol").value.trim();

    if(document.getElementById("rol").value.trim().length > 20){
        return false;
    }

    return (texto !== "");
}    

function EsDescripcionValida(){

    let texto = document.getElementById("sobre_mi").value.trim();

    if(document.getElementById("sobre_mi").value.trim().length > 150){
        return false;
    }

    return texto !== "";
}    

function SonLinksValidos(){

    let result = true;
    
    document.querySelectorAll('.mi_link').forEach(input => {
        if(input.value !== ""){
            try{
                new URL(input.value.trim());
            } catch {
                result = false;
                input.focus();
            }
        }
    });

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
    if (!img.base64 || !img.fileName ) {
        return false;
    }

    if (img.base64 == "" || img.fileName == "") {
        return false;
    }

    // Validar que la URL sea de una imagen
    if (!img.base64.startsWith('data:image')) {
        return false;
    }

    if (!(img &&
        typeof img.base64 === 'string' &&
        typeof img.fileName === 'string')) {
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
    console.log(JSON.stringify(infoPerfil));
    fetch('/editarDatosPerfil', {
        method: 'POST', // Método HTTP
        headers: {
            'Content-Type': 'application/json', // Tipo de contenido
        },
        body: JSON.stringify(infoPerfil), // Convertir el objeto a JSON
    }).then(data => {
        alert("Perfil guardado con exito!");
        window.location.href = "/verMiPerfil";
    })

}