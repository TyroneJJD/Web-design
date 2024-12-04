/// <reference lib="deno.ns" />

import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";

import { inicializarBlog } from "./Secciones/Blog/Controlador/Controlador.ts";
import { inicializarBuscadorInterships } from "./Secciones/BuscadorInterships/Controlador/Controlador.ts";
import { inicializarLandingPage } from "./Secciones/LandingPage/Controlador/Controlador.ts";
import { inicializarLogin } from "./Secciones/Login/Controlador/Controlador.ts";
import { inicializarMiPerfil } from "./Secciones/MiPerfil/Controlador/Controlador.ts";
import { inicializarPaginaInicio } from "./Secciones/PaginaInicio/Controlador/Controlador.ts";
import { inicializarPanelAdministrador } from "./Secciones/PanelAdministrador/Controlador/Controlador.ts";
import { inicializarProblemasProgramacionCompetitiva } from "./Secciones/ProblemasProgramacionCompetitiva/Controlador/Controlador.ts";
import { inicializarExplorarEntrevistadores } from "./Secciones/ExplorarEntrevistadores/Controlador/Controlador.ts";
import { inicializarReuniones } from "./Secciones/Reuniones/Controlador/Controlador.ts";
import { inicializarPanelAdmin_ProblemasCompetitiva } from "./Secciones/PanelAdministrador/Controlador/ControladorProblemasCompetitiva.ts";

import {
  verificarVariablesDeEntornoDefinidas,
  cargarArchivosEstaticos,
  paginaNoEncontrada
} from "./utilidadesServidor.ts";

verificarVariablesDeEntornoDefinidas();

const app = new Application();
const router = new Router();

app.use(
  cargarArchivosEstaticos(
    "/css_global/",
    "./Secciones/ColorYFuente/css_General"
  )
);

app.use(
  cargarArchivosEstaticos(
    "/js_global/",
    "./Secciones/ColorYFuente/js_General"
  )
);

inicializarPaginaInicio(router, app);
inicializarLogin(router, app);
inicializarBlog(router, app);
inicializarBuscadorInterships(router, app);
inicializarLandingPage(router, app);
inicializarMiPerfil(router, app);
inicializarPanelAdministrador(router, app);
inicializarProblemasProgramacionCompetitiva(router, app);
inicializarExplorarEntrevistadores(router, app);
inicializarReuniones(router, app);
inicializarPanelAdmin_ProblemasCompetitiva(router, app);

//app.use(paginaNoEncontrada());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });
