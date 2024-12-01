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

import {
  verificarVariablesDeEntornoDefinidas,
  cargarArchivosEstaticos,
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

inicializarPaginaInicio(router, app);
inicializarLogin(router, app);
inicializarBlog(router, app);
inicializarBuscadorInterships(router, app);
inicializarLandingPage(router, app);
inicializarMiPerfil(router, app);
inicializarPanelAdministrador(router, app);
inicializarProblemasProgramacionCompetitiva(router, app);
inicializarExplorarEntrevistadores(router, app);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8080 });
