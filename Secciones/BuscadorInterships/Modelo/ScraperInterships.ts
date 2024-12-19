import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import { GestorInterships } from "../../../Servicios/BaseDeDatos/GestorInterships.ts";
import { IOfertaIntership } from "../../../Servicios/BaseDeDatos/DatosIntership.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

export class ScraperInterships {
  private gestorInterships: GestorInterships;

  constructor() {
    this.gestorInterships = new GestorInterships();

    this.visualizarInterships = this.visualizarInterships.bind(this);
    this.visualizarIntershipsEspecifico = this.visualizarIntershipsEspecifico
      .bind(this);
  }

  public async visualizarInterships(context: Context) {
    try {
      const arregloInterships = await this.gestorInterships
        .obtenerOfertasIntershipsV2();
      const html = await renderizarVista(
        "TablaInterships.html",
        { ofertas: arregloInterships },
        directorioVistaSeccionActual + `/html_BuscadorInterships`,
      );
      context.response.body = html || "Error al renderizar la página";
    } catch (error) {
      if (error instanceof Error) {
        context.response.body = `Error: ${error.message}`;
      } else {
        context.response.body = "An unknown error occurred";
      }
    }
  }

  public async visualizarIntershipsEspecifico(context: Context) {
    const url = new URL(context.request.url);
    const nombreCompania = url.searchParams.get("nombreCompania");

    if (!nombreCompania || nombreCompania.trim() === "") {
      context.response.headers.set("Location", "/BuscadorIntershipsV2");
      return;
    }

    const ofertaDB = await this.gestorInterships.obtenerOfertaEspecifica(
      nombreCompania,
    );

    const html = await renderizarVista(
      "TablaInterships.html",
      { ofertas: ofertaDB },
      directorioVistaSeccionActual + `/html_BuscadorInterships`,
    );
    context.response.body = html || "Error al renderizar la página";
  }

  private async obtenerInterships_SimplifyJobs(): Promise<IOfertaIntership[]> {
    const contenidoObtenido = await this.extraerDatos_SimplifyJobsPage(
      "https://github.com/SimplifyJobs/Summer2025-Internships",
    );
    return this.removerElementosConCamposVacios(contenidoObtenido);
  }

  private async extraerDatos_SimplifyJobsPage(
    url: string,
  ): Promise<IOfertaIntership[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const jobPostings: IOfertaIntership[] = [];
      const rows = $("table tr");

      // Iterar sobre cada fila, comenzando desde la segunda (si la primera es el encabezado)
      rows.each((index, row) => {
        // Omitimos la primera fila si es el encabezado
        if (index === 0) return;

        const cells = $(row).find("td");
        if (cells.length > 0) {
          const jobPosting: IOfertaIntership = {
            compania: $(cells[0]).text().trim(),
            rol: $(cells[1]).text().trim(),
            locacion: $(cells[2]).text().trim(),
            linkFuentePublicacion: $(cells[3]).find("a").attr("href") || "",
            fechaPosteado: $(cells[4]).text().trim(),
          };
          jobPostings.push(jobPosting);
        }
      });

      return jobPostings;
    } catch (error) {
      console.error("Error en el scraping:", error);
      return [];
    }
  }

  private removerElementosConCamposVacios(
    jobPostings: IOfertaIntership[],
  ): IOfertaIntership[] {
    return jobPostings.filter((posting) => {
      return (
        posting.compania.trim() !== "" &&
        posting.rol.trim() !== "" &&
        posting.locacion.trim() !== "" &&
        posting.linkFuentePublicacion.trim() !== "" &&
        posting.fechaPosteado.trim() !== ""
      );
    });
  }
}
