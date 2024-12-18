import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatos/BaseDeDato.ts";
import { ISesionEntrevista } from "../../../Servicios/BaseDeDatos/Reuniones.ts";
import { IUsuario } from "../../../Servicios/BaseDeDatos/DatosUsuario.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { ObjectId } from "npm:mongodb";
import { obtenerIdUsuario } from "../../../Servicios/Autenticacion.ts";

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
