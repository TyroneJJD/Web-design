import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";
import { BaseDeDatosMySQL } from "../../../Servicios/BaseDeDatosMySQL.ts";

interface IProblemaCompetitiva {
  nombreProblema: string;
  plataformaProblema: string;
  dificultadProblema: string;
  categoriasProblema: string[];
  urlProblema: string;
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
    p.Clave, 
    p.Nombre, 
    p.Plataforma, 
    p.Enlace, 
    p.Dificultad, 
    GROUP_CONCAT(pc.NombreCategoria) AS Categorias
    FROM 
        Problemas p
    LEFT JOIN 
        Problemas_Cat pc
    ON 
        p.Clave = pc.ClaveProblema
    GROUP BY 
        p.Clave
    ORDER BY 
        p.FechaCreacion DESC
    LIMIT 3;
      `;

    try {
      const resultados = await db.ejecutarConsulta(selectQuery);

      const problemas: IProblemaCompetitiva[] = (resultados as any[]).map(
        (fila) => ({
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
      // Verificar que el parámetro 'categoria' esté presente
      const url = new URL(context.request.url);
      const nombreProblema = url.searchParams.get("nombreProblema");
      console.log(nombreProblema);
      if (!nombreProblema) {
        context.response.headers.set(
          "Location",
          "/ProblemasProgramacionCompetitiva"
        );
        return;
      }

      // Consultar problemas en base a la categoría
      const problemas = await this.consultarProblemasConNombre(nombreProblema);

      // Renderizar la vista
      const html = await renderizarVista(
        "Buscador.html",
        { problemas },
        directorioVistaSeccionActual + `/html_ProblemasProgramacionCompetitiva`
      );

      context.response.body = html || "Error al renderizar la página";
    } catch (error) {
      // Manejar cualquier error durante la ejecución
      console.error(
        "Error en BuscadorProblemasProgramacionCompetitivaEspecifico:",
        error
      );
      context.response.status = 500; // Error interno del servidor
      context.response.body = "Error al procesar la solicitud.";
    }
  }

  private async consultarProblemasConNombre(
    categoria: string
  ): Promise<IProblemaCompetitiva[]> {
    const db = BaseDeDatosMySQL.obtenerInstancia();
    const query = `
  SELECT 
    p.Clave, 
    p.Nombre AS nombreProblema, 
    p.Plataforma AS plataformaProblema, 
    p.Enlace AS urlProblema, 
    p.Dificultad AS dificultadProblema, 
    GROUP_CONCAT(pc.NombreCategoria) AS Categorias
  FROM 
    Problemas p
  LEFT JOIN 
    Problemas_Cat pc
  ON 
    p.Clave = pc.ClaveProblema
  WHERE 
    p.Nombre LIKE ?
  GROUP BY 
    p.Clave
  ORDER BY 
    p.Clave DESC;
`;
    const categoriaParcial = `%${categoria}%`;

    // Realizar la consulta
    const resultados: any[] = await db.ejecutarConsulta(query, [
      categoriaParcial,
    ]);

    console.log(resultados);
    // Mapear los resultados a la interfaz IProblemaCompetitiva
    return resultados.map((row) => ({
      nombreProblema: row.nombreProblema,
      plataformaProblema: row.plataformaProblema,
      dificultadProblema: row.dificultadProblema,
      categoriasProblema: row.Categorias ? row.Categorias.split(",") : [], // Convertir la cadena a un arreglo
      urlProblema: row.urlProblema,
    }));
  }
}
