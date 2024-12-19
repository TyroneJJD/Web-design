import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { ISesionEntrevista } from "../../../Servicios/BaseDeDatos/Entrevistas.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { GestorDatosUsuario } from "../../../Servicios/BaseDeDatos/GestorDatosUsuario.ts";
import { GestorEntrevista } from "../../../Servicios/BaseDeDatos/GestorEntrevista.ts";
import { obtenerIdUsuario } from "../../../Servicios/GestorPermisos.ts";

// <!!!!!----------!!!!!> ZONA DE GUERRA

export class CalendarioTrainee {
  private gestorDatosUsuario: GestorDatosUsuario;
    private gestorEntrevista: GestorEntrevista;
  constructor() {
    this.gestorDatosUsuario = new GestorDatosUsuario();
    this.gestorEntrevista = new GestorEntrevista();
    this.mostrarCalendarioTrainee = this.mostrarCalendarioTrainee.bind(this);
  }

  public async mostrarCalendarioTrainee(context: Context) {
    const IDusuario = await obtenerIdUsuario(context);

    if (!IDusuario) {
      throw new Error("ID de usuario no encontrado");
    }
    const datosUsuario = await this.gestorDatosUsuario.obtenerUsuarioPorId(IDusuario);
    const reuniones = await this.gestorEntrevista.obtenerReunionesPorCandidato(IDusuario);

    const html = await renderizarVista(
      "CalendarioTrainee.html",
      {
        datosUsuario: datosUsuario,
        reuniones: reuniones,
      },
      directorioVistaSeccionActual + `/html_Reuniones`,
    );

    context.response.body = html || "Error al renderizar la página";
  }

  

  
}
