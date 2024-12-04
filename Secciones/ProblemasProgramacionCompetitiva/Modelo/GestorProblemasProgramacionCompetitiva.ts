import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
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
    const problemas = await this.consultarProblemas();

    const html = await renderizarVista(
      "Buscador.html",
      { problemas },
      directorioVistaSeccionActual + `/html_ProblemasProgramacionCompetitiva`
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
          "/ProblemasProgramacionCompetitiva"
        );
        return;
      }

      const problemas = await this.consultarProblemasConNombre(nombreProblema);

      const html = await renderizarVista(
        "Buscador.html",
        { problemas },
        directorioVistaSeccionActual + `/html_ProblemasProgramacionCompetitiva`
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
