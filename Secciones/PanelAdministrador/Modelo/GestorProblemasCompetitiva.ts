
// <!----------> FULL REFACTOR PARA MONGODB

/*import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/ControladorPermisos.ts";
import { BaseDeDatosMySQL } from "../../../Servicios/BaseDeDatosMySQL.ts";

interface IProblemaCompetitiva {
  idProblema: string;
  nombreProblema: string;
  plataformaProblema: string;
  dificultadProblema: string;
  categoriasProblema: Set<string>;
  urlProblema: string;
}

interface ICategoria {
    idCategoria: string;
    nombreCategoria: string;
}

interface IDificultad {
    idDificultad: string;
    nombreDificultad: string;
}

interface IPlataforma {
    idPlataforma: string;
    nombrePlataforma: string;
}

export class GestorProblemasProgramacionCompetitiva {
  constructor() {
    this.consultarProblemas = this.consultarProblemas.bind(this);
    this.BuscadorProblemasProgramacionCompetitiva =
      this.BuscadorProblemasProgramacionCompetitiva.bind(this);

    this.consultarProblemasConNombre =
      this.consultarProblemasConNombre.bind(this);
    this.BuscadorProblemasProgramacionCompetitivaEspecifico =
      this.BuscadorProblemasProgramacionCompetitivaEspecifico.bind(this);
  }
  private async consultarProblemas(): Promise<IProblemaCompetitiva[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();

    const selectQuery = `
      SELECT 
    P.Clave AS Clave, 
    P.Nombre AS Nombre, 
    P.Enlace AS Enlace,
    Pl.Nombre AS Plataforma, 
    D.Nombre AS Dificultad,
    GROUP_CONCAT(C.Nombre ORDER BY C.Nombre SEPARATOR ', ') AS Categorias
FROM 
    Problemas P
JOIN 
    Plataformas Pl ON P.Plataforma = Pl.Clave_Plataforma
JOIN 
    Dificultades D ON P.Dificultad = D.Clave_Dificultad
JOIN 
    Problemas_Categorias PC ON P.Clave = PC.Problema_Clave
JOIN 
    Categorias C ON PC.Categoria_Clave = C.Clave_Categoria
GROUP BY 
    P.Clave
ORDER BY 
    P.Clave DESC
LIMIT 3;
      `;

    try {
      const resultados = await db.ejecutarConsulta(selectQuery);

      const problemas: IProblemaCompetitiva[] = (resultados as any[]).map(
        (fila) => ({
          idProblema: fila.Clave,
          nombreProblema: fila.Nombre,
          plataformaProblema: fila.Plataforma,
          dificultadProblema: fila.Dificultad,
          categoriasProblema: fila.Categorias ? fila.Categorias.split(",") : [],
          urlProblema: fila.Enlace,
        })
      );

      return problemas;
    } catch (error) {
      console.error("Error al consultar los problemas:", error);
      return [];
    }
  }

  public async BuscadorProblemasProgramacionCompetitiva(context: Context) {
    const problemas = await this.consultarProblemasConNombre('""');
    const categorias = await this.consultarCategorias();
    const plataformas = await this.consultarPlataformas();
    const dificultades = await this.consultarDificultades();

    const html = await renderizarVista(
      "panelProblemasCompetitiva.html",
      { problemas:problemas, categorias:categorias, plataformas:plataformas, dificultades:dificultades },
      directorioVistaSeccionActual + `/html_PanelAdministrador`
    );
    context.response.body = html || "Error al renderizar la página";
  }

  public async BuscadorProblemasProgramacionCompetitivaEspecifico(
    context: Context
  ) {
    try {
      const url = new URL(context.request.url);
      const nombreProblema = url.searchParams.get("nombreProblema");
      if (!nombreProblema || nombreProblema.trim() === "") {
        context.response.headers.set(
          "Location",
          "/AdminPanel_ProblemasCompetitiva"
        );
        return;
      }

      const problemas = await this.consultarProblemasConNombre(nombreProblema);
      const categorias = await this.consultarCategorias();
      const plataformas = await this.consultarPlataformas();
      const dificultades = await this.consultarDificultades();

      const html = await renderizarVista(
        "panelProblemasCompetitiva.html",
        { problemas:problemas, categorias:categorias, plataformas:plataformas, dificultades:dificultades },
        directorioVistaSeccionActual + `/html_PanelAdministrador`
      );

      context.response.body = html || "Error al renderizar la página";
    } catch (error) {
      console.error(
        "Error en BuscadorProblemasProgramacionCompetitivaEspecifico:",
        error
      );
      context.response.status = 500;
      context.response.body = "Error al procesar la solicitud.";
    }
  }

  private async agregarProblema(
    nombreProblema: string,
    plataforma: string,
    dificultad: string,
    categorias: string[],
    urlProblema: string
  ): Promise<boolean> {
    try {
      const db = BaseDeDatosMySQL.obtenerInstancia();
      const query = `
        INSERT INTO Problemas (Nombre, Plataforma, Dificultad, Enlace)
        VALUES (?, ?, ?, ?);
      `;
      const resultados = await db.ejecutarConsulta(query, [
        nombreProblema,
        plataforma,
        dificultad,
        urlProblema,
      ]);

      if (resultados.affectedRows === 0) {
        return false;
      }

      const idProblema = resultados.insertId;

      const queryCategorias = `
        INSERT INTO Problemas_Categorias (Problema_Clave, Categoria_Clave)
        VALUES (?, ?);
      `;
      for (const categoria of categorias) {
        await db.ejecutarConsulta(queryCategorias, [idProblema, categoria]);
      }

      return true;
    } catch (error) {
      console.error("Error al agregar el problema:", error);
      return false;
    }
  }

    public agregarProblemaProgramacionCompetitiva = async (context: Context) => {
        try {
        const url = new URL(context.request.url);
        const nombreProblema = url.searchParams.get("nombre");
        const plataforma = url.searchParams.get("plataforma");
        const dificultad = url.searchParams.get("dificultad");
        const categorias_list = url.searchParams.get("categorias").split(",");
        const urlProblema = url.searchParams.get("link");

        if (
            !nombreProblema ||
            !plataforma ||
            !dificultad ||
            !urlProblema ||
            categorias_list.length === 0
        ) {
            context.response.status = 400;
            context.response.body = "Datos incompletos.";
            return;
        }

        console.log(`Datos del problema a agregar:`, {
            nombreProblema,
            plataforma,
            dificultad,
            categorias_list,
            urlProblema,
        });
    
        const estadoAgregacion = await this.agregarProblema(
            nombreProblema,
            plataforma,
            dificultad,
            categorias_list,
            urlProblema
        );
    
        if (!estadoAgregacion) {
            context.response.status = 500;
            context.response.body = "No se pudo agregar el problema.";
            return;
        }
    
        context.response.redirect("/AdminPanel_ProblemasCompetitivaEspecifico?nombreProblema=" + nombreProblema);
        } catch (error) {
        console.error("Error en Agregar Problema:", error);
        context.response.status = 500;
        context.response.body = "Error al procesar la solicitud.";
        }
    }


  private async eliminarProblema(claveProblema: string): Promise<boolean> {
    try {
      const db = BaseDeDatosMySQL.obtenerInstancia();
      const query = `DELETE FROM Problemas WHERE Clave = ?;`;
      const resultados = await db.ejecutarConsulta(query, [claveProblema]);

      console.log(`Resultado de la eliminación:`, resultados);
      return resultados.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar el problema:", error);
      return false;
    }
  }

  public eliminarProblemaProgramacionCompetitiva = async (context: Context) => {
    try {
      const url = new URL(context.request.url);
      const claveProblema = url.searchParams.get("idProblema");

      if (!claveProblema || claveProblema.trim() === "") {
        context.response.status = 400;
        context.response.body = "Clave del problema inválida.";
        return;
      }

      const estadoEliminar = await this.eliminarProblema(claveProblema);

      if (!estadoEliminar) {
        context.response.status = 500;
        context.response.body = "No se pudo eliminar el problema.";
        return;
      }

      context.response.redirect("/AdminPanel_ProblemasCompetitiva");
    } catch (error) {
      console.error("Error en Eliminar Problema:", error);
      context.response.status = 500;
      context.response.body = "Error al procesar la solicitud.";
    }
  }

  private async modificarProblema(
    claveProblema: string,
    nombreProblema: string,
    plataforma: string,
    dificultad: string,
    categorias: string[],
    urlProblema: string
  ): Promise<boolean> {
    try {
      const db = BaseDeDatosMySQL.obtenerInstancia();
      const query = `
        UPDATE Problemas
        SET Nombre = ?, Plataforma = ?, Dificultad = ?, Enlace = ?
        WHERE Clave = ?;
      `;
      const resultados = await db.ejecutarConsulta(query, [
        nombreProblema,
        plataforma,
        dificultad,
        urlProblema,
        claveProblema,
      ]);

      if (resultados.affectedRows === 0) {
        return false;
      }

      const queryEliminarCategorias = `
        DELETE FROM Problemas_Categorias
        WHERE Problema_Clave = ?;
      `;
      await db.ejecutarConsulta(queryEliminarCategorias, [claveProblema]);

      const queryCategorias = `
        INSERT INTO Problemas_Categorias (Problema_Clave, Categoria_Clave)
        VALUES (?, ?);
      `;
      for (const categoria of categorias) {
        await db.ejecutarConsulta(queryCategorias, [claveProblema, categoria]);
      }

      return true;
    } catch (error) {
      console.error("Error al modificar el problema:", error);
      return false;
    }
  }

  public modificarProblemaProgramacionCompetitiva = async (context: Context) => {
    try {
      const url = new URL(context.request.url);
      const claveProblema = url.searchParams.get("idProblema");
      const nombreProblema = url.searchParams.get("nombre");
      const plataforma = url.searchParams.get("plataforma");
      const dificultad = url.searchParams.get("dificultad");
      const categorias_list = url.searchParams.get("categorias").split(",");
      const urlProblema = url.searchParams.get("link");

      if (
        !claveProblema ||
        !nombreProblema ||
        !plataforma ||
        !dificultad ||
        !urlProblema ||
        categorias_list.length === 0
      ) {
        context.response.status = 400;
        context.response.body = "Datos incompletos.";
        return;
      }

      const estadoModificacion = await this.modificarProblema(
        claveProblema,
        nombreProblema,
        plataforma,
        dificultad,
        categorias_list,
        urlProblema
      );

      if (!estadoModificacion) {
        context.response.status = 500;
        context.response.body = "No se pudo modificar el problema.";
        return;
      }

      context.response.redirect("/AdminPanel_ProblemasCompetitivaEspecifico?nombreProblema=" + nombreProblema);
    } catch (error) {
      console.error("Error en Modificar Problema:", error);
      context.response.status = 500;
      context.response.body = "Error al procesar la solicitud.";
    }
  }

  private async consultarPlataformas(): Promise<IPlataforma[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();
    const query = `SELECT * FROM Plataformas ORDER BY Clave_Plataforma ;`;

    try {
      const resultados = await db.ejecutarConsulta(query);

      const plataformas: IPlataforma[] = (resultados as any[]).map((fila) => ({
        idPlataforma: fila.Clave_Plataforma,
        nombrePlataforma: fila.Nombre,
      }));

      return plataformas;
    } catch (error) {
      console.error("Error al consultar las plataformas:", error);
      return [];
    }
  }

  private async consultarDificultades(): Promise<IDificultad[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();
    const query = `SELECT * FROM Dificultades ORDER BY Clave_Dificultad;`;

    try {
      const resultados = await db.ejecutarConsulta(query);

      const dificultades: IDificultad[] = (resultados as any[]).map((fila) => ({
        idDificultad: fila.Clave_Dificultad,
        nombreDificultad: fila.Nombre,
      }));

      return dificultades;
    } catch (error) {
      console.error("Error al consultar las dificultades:", error);
      return [];
    }
  }

  private async consultarCategorias(): Promise<ICategoria[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();
    const query = `
      SELECT * FROM Categorias ORDER BY Clave_Categoria;
    `;

    try {
      const resultados = await db.ejecutarConsulta(query);

        const categorias: ICategoria[] = (resultados as any[]).map((fila) => ({
            idCategoria: fila.Clave_Categoria,
            nombreCategoria: fila.Nombre,
        }));

        return categorias;

    } catch (error) {
      console.error("Error al consultar las categorías:", error);
      return [];
    }
  }

  private async consultarProblemasConNombre(
    categoria: string
  ): Promise<IProblemaCompetitiva[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();
    const query = `
  SELECT 
    P.Clave AS Clave, 
    P.Nombre AS nombreProblema, 
    P.Enlace AS urlProblema,
    Pl.Nombre AS plataformaProblema, 
    D.Nombre AS dificultadProblema,
    GROUP_CONCAT(C.Nombre ORDER BY C.Nombre SEPARATOR ', ') AS Categorias
FROM 
    Problemas P
JOIN 
    Plataformas Pl ON P.Plataforma = Pl.Clave_Plataforma
JOIN 
    Dificultades D ON P.Dificultad = D.Clave_Dificultad
JOIN 
    Problemas_Categorias PC ON P.Clave = PC.Problema_Clave
JOIN 
    Categorias C ON PC.Categoria_Clave = C.Clave_Categoria
WHERE
    P.Nombre LIKE ?
    GROUP BY 
    P.Clave
ORDER BY 
    P.Clave DESC
`;
    const categoriaParcial = `%${categoria}%`;

    // Realizar la consulta
    const resultados: any[] = await db.ejecutarConsulta(query, [
      categoriaParcial,
    ]);

    console.log(resultados);
    // Mapear los resultados a la interfaz IProblemaCompetitiva
    return resultados.map((row) => ({
        idProblema: row.Clave,
      nombreProblema: row.nombreProblema,
      plataformaProblema: row.plataformaProblema,
      dificultadProblema: row.dificultadProblema,
      //Convertir las categorías a un set
      categoriasProblema: row.Categorias ? new Set(row.Categorias.split(",")) : new Set(),
      urlProblema: row.urlProblema,
    }));
  }
}
*/