import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDatos.ts";
import { ISesionEntrevista } from "../../../Servicios/BaseDeDatos/Entrevistas.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

import { obtenerIdUsuario } from "../../../Servicios/GestorPermisos.ts";

// <!!!!!----------!!!!!> ZONA DE GUERRA

export class CalendarioTrainee {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();

    this.mostrarCalendarioTrainee = this.mostrarCalendarioTrainee.bind(this);
  }

  public async mostrarCalendarioTrainee(context: Context) {
    const IDusuario = await obtenerIdUsuario(context);

    if (!IDusuario) {
      throw new Error("ID de usuario no encontrado");
    }
    const datosUsuario = await this.obtenerUsuarioPorId(IDusuario);
    const reuniones = await this.obtenerReunionesPorCandidato(IDusuario);

    const html = await renderizarVista(
      "CalendarioTrainee.html",
      {
        datosUsuario: datosUsuario,
        reuniones: reuniones,
      },
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }

  public async obtenerUsuarioPorId(id: string): Promise<IUsuario> {
    const collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios"
    ) as unknown as Collection<IUsuario>;

    const usuario = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

    // <!----------> reparar debido al cambio en el modelo de datos
  public async obtenerReunionesPorCandidato(
    idCandidato: string
  ): Promise<ISesionEntrevista[]> {
    // Obtener la referencia a la colección de reuniones
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
  
    // Buscar reuniones donde el candidato esté registrado
    const reuniones = await collection
      .find({ "candidatosRegistrados.idCandidatoRegistrado": idCandidato })
      .toArray();
  
    // Si no se encuentran reuniones, devolver un arreglo vacío
    if (!reuniones || reuniones.length === 0) {
      return [];
    }
  
    // Retornar las reuniones encontradas
    return reuniones;
  }
  
}
