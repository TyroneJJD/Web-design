import { BaseDeDatos } from "./BaseDeDatos.ts";
import { IUsuario } from "./DatosUsuario.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";
import { ManejadorArchivos } from "../ManejadorArchivos.ts";

export class GestorDatosUsuario {
  private db: BaseDeDatos;
  private collection: Collection<IUsuario>;

  constructor() {
    this.db = BaseDeDatos.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios",
    ) as unknown as Collection<IUsuario>;
  }

  public async obtenerEntrevistadores(): Promise<IUsuario[]> {
    const entrevistadores = await this.collection
      .find({ "permisosUsuario.esCoach": true })
      .toArray();
    return entrevistadores;
  }

  public async obtenerUsuarioPorId(id: string): Promise<IUsuario> {
    const usuario = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  public async obtenerUsuarioPorCredenciales(
    correoElectronico: string,
    contrasenia: string,
  ): Promise<IUsuario | null> {
    try {
      const usuario = await this.collection.findOne({
        correoElectronicoInstitucionalUsuario: correoElectronico,
        contraseniaUsuario: contrasenia,
      });

      if (!usuario) {
        throw new Error("Correo electrónico o contraseña incorrectos.");
      }

      return usuario;
    } catch (_error) {
      // El usuario no existe
      return null;
    }
  }

  public async crearNuevoUsuario(
    usuario: Omit<IUsuario, "_id">,
  ): Promise<IUsuario> {
    // Por seguridad todo usuario nuevo inicia con permisos desactivados
    usuario.permisosUsuario.esAdministrador = false;
    usuario.permisosUsuario.esCoach = false;
    usuario.permisosUsuario.puedePublicarEnElBlog = false;
    usuario.permisosUsuario.puedePublicarProblemas = false;

    const result = await this.collection.insertOne(usuario);
    return { _id: result, ...usuario };
  }

  // REFACTOR !!!!!!!!
  public async ActualizaImagenes(archivoJSON: any, idUsuario: string) {
    const manejadorArchivos = new ManejadorArchivos();
    let urlNuevaFotoPerfil;
    let urlNuevaFotoBackground;

    const FotoPerfil = archivoJSON.imagenPerfil;
    const FotoBackground = archivoJSON.imagenBackground;

    console.log(FotoPerfil);
    console.log(FotoBackground);

    let FotoPerfilProcesada;
    let FotoBackgroundProcesada;

    if (FotoPerfil.fileName == "") {
      FotoPerfilProcesada = true;
    } else {
      urlNuevaFotoPerfil = await manejadorArchivos.guardarFotoDePerfil(
        FotoPerfil,
        idUsuario,
      );
      const result = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        {
          $set: {
            direccionURLFotoPerfil: urlNuevaFotoPerfil ?? "",
          },
        },
      );

      FotoPerfilProcesada = result.modifiedCount !== 0;
    }

    if (FotoBackground.fileName == "") {
      FotoBackgroundProcesada = true;
    } else {
      urlNuevaFotoBackground = await manejadorArchivos.guardarFotoDeBackground(
        FotoBackground,
        idUsuario,
      );
      const result = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        {
          $set: {
            direccionURLFotoBackground: urlNuevaFotoBackground ?? "",
          },
        },
      );

      FotoBackgroundProcesada = result.modifiedCount !== 0;
    }

    console.log({ FotoPerfilProcesada, FotoBackgroundProcesada });
    return { FotoPerfilProcesada, FotoBackgroundProcesada };
  }

  public async ActualizaUsuario(
    archivoJSON: {
      titularUsuario: string;
      descripcionUsuario: string;
      linkLinkendin: string;
      linkGithub: string;
      linkPortafolioPersonal: string;
    },
    idUsuario: string,
  ) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(idUsuario) },
      {
        $set: {
          titularUsuario: archivoJSON.titularUsuario ?? undefined,
          descripcionUsuario: archivoJSON.descripcionUsuario ?? undefined,
          linksUsuario: {
            linkLinkendin: archivoJSON.linkLinkendin ?? "",
            linkGithub: archivoJSON.linkGithub ?? "",
            linkPortafolioPersonal: archivoJSON.linkPortafolioPersonal ?? "",
          },
        },
      },
    );

    return result.modifiedCount !== 0;
  }

  public async recuperarUsuariosQueSonCandidatosACoach(): Promise<IUsuario[]> {
    const usuariosCoach = await this.collection
      .find({ quiereSerCoach: true })
      .toArray();
    return usuariosCoach;
  }

  public async actualizarPermisos(
    idUsuario: string,
    permiso: string,
    estado: boolean,
  ): Promise<string> {
    try {
      if (!ObjectId.isValid(idUsuario)) {
        return "ID de usuario no válido";
      }

      const updateResult = await this.collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        { $set: { [permiso]: estado } },
      );

      if (updateResult.modifiedCount > 0) {
        return "Permiso actualizado correctamente";
      } else {
        return "No se pudo actualizar el permiso";
      }
    } catch (error) {
      console.error(error);
      return "Error al actualizar el permiso";
    }
  }

  public async obtenerTodosLosUsuarios(): Promise<IUsuario[]> {
    return await this.collection.find().toArray();
  }

  public async eliminarUsuarioPorId(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(id),
      });

      return result === 1; // Verificar si la eliminación fue exitosa
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      return false;
    }
  }

  //--------------------------------------------- ZONA DE GUERRA ---------------------------------------------
  
  public async obtenerEntrevistadorPorId(id: string): Promise<IUsuario> {
    const collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios",
    ) as unknown as Collection<IUsuario>;

    const usuario = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  private async obtenerEntrevistadorPorIdV2(id: string): Promise<IUsuario> {
    const collection = this.db.obtenerReferenciaColeccion<IUsuario>(
      "Usuarios",
    ) as unknown as Collection<IUsuario>;

    const usuario = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

 

}
