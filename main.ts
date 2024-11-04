import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";

import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { manejadorSubidaArchivo } from "./Controlador/subidaArchivo.ts";

import {
  renderPaginaInicio,
  renderPaginaProtegida,
  renderSubidaArchivos,
} from "./Controlador/general.ts";

import {
  cargarArchivosEstaticos,
  verificadorAutenticacion,
} from "./serverUtils.ts";

import { manejadorLogin, renderPaginaLogin } from "./Controlador/login.ts";

configure({ views: `${Deno.cwd()}/views` });

const app = new Application();
app.use(cargarArchivosEstaticos("/styles"));
app.use(cargarArchivosEstaticos("/javascript"));

const router = new Router();
//-------------------------Rutas-------------------------

router.get("/", renderPaginaInicio);

router.get("/subida", renderSubidaArchivos);
router.post("/subida", async (context) => {
  await manejadorSubidaArchivo(context);
});

router.get("/login", renderPaginaLogin);
router.post("/login", async (ctx: Context) => {
  await manejadorLogin(ctx);
});

router.get("/protected", verificadorAutenticacion, renderPaginaProtegida);

//-------------------------Rutas-------------------------
app.use(router.routes());
app.use(router.allowedMethods());
console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });
