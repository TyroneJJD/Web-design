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
}
