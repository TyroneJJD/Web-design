import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { arrancarRutas } from "./Controlador/rutas.ts";

import {
  cargarArchivosEstaticos,
  verificarVariablesDeEntornoDefinidas,
} from "./utilidadesServidor.ts";

configure({ views: `${Deno.cwd()}/Vista/html` });
verificarVariablesDeEntornoDefinidas();

const app = new Application();

app.use(cargarArchivosEstaticos("/css", `${Deno.cwd()}/Vista/css`));
app.use(cargarArchivosEstaticos("/js", `${Deno.cwd()}/Vista/js`));

const router = new Router();

arrancarRutas(router);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });
