import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { IUsuario } from "../../DatosUsuario.ts";
import { obtenerIdUsuario } from "../../../Servicios/Autenticacion.ts";
import { ObjectId } from "npm:bson@6";
import { ISesionEntrevista } from "../../Reuniones.ts";

export class GestorReuniones {
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.obtenerUsuarioPorId = this.obtenerUsuarioPorId.bind(this);
    this.obtenerReunionesPorCandidato = this.obtenerReunionesPorCandidato.bind(this);
    this.mostrarCalendarioTrainee = this.mostrarCalendarioTrainee.bind(this);
    
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

  public async obtenerReunionesPorCandidato(id: string): Promise<ISesionEntrevista[]> {
    const collection = this.db.obtenerReferenciaColeccion<ISesionEntrevista>(
      "Reuniones"
    ) as unknown as Collection<ISesionEntrevista>;
  
    const reuniones = await collection
      .find({ "candidatosRegistrados.idCandidatoRegistrado": id })
      .toArray();
  
    if (reuniones.length === 0) {
      throw new Error(`No se encontraron reuniones con el candidato ID ${id}`);
    }
  
    return reuniones;
  }

  public async mostrarCalendarioTrainee(context: Context) {
    //const IDusuario = await obtenerIdUsuario(context);
    const IDusuario = "674cce539dca6ab3034178fa";

    if (!IDusuario) {
      throw new Error("ID de usuario no encontrado");
    }
    const datosUsuario = await this.obtenerUsuarioPorId(IDusuario);
    const reuniones = await this.obtenerReunionesPorCandidato(IDusuario);
    console.log(reuniones);

    const html = await renderizarVista(
      "CalendarioTrainee.html",
      {datosUsuario },
      directorioVistaSeccionActual + `/html_Reuniones`
    );

    context.response.body = html || "Error al renderizar la página";
  }
}
