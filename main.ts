import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { arrancarRutas } from "./Controlador/arrancarRutas.ts";

import {
  cargarArchivosEstaticos,
  verificarQueLasVariablesDeEntornoEstenDefinidas,
} from "./utilidadesServidor.ts";

verificarQueLasVariablesDeEntornoEstenDefinidas();
configure({ views: `${Deno.cwd()}/views` });

const app = new Application();
app.use(cargarArchivosEstaticos("/styles"));
app.use(cargarArchivosEstaticos("/javascript"));

const router = new Router();

arrancarRutas(router);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });
