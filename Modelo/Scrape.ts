import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";

interface ofertaIntership {
  compania: string;
  rol: string;
  locacion: string;
  linkFuentePublicacion: string;
  fechaPosteado: string;
}

export class Scraper {
  public async obtenerInterships_SimplifyJobs(): Promise<ofertaIntership[]> {
    const contenidoObtenido = await this.extraerDatos_SimplifyJobsPage(
      "https://github.com/SimplifyJobs/Summer2025-Internships"
    );
    return this.removerElementosConCamposVacios(contenidoObtenido);
  }

  private async extraerDatos_SimplifyJobsPage(
    url: string
  ): Promise<ofertaIntership[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const jobPostings: ofertaIntership[] = [];
      const rows = $("table tr");

      // Iterar sobre cada fila, comenzando desde la segunda (si la primera es el encabezado)
      rows.each((index, row) => {
        // Omitimos la primera fila si es el encabezado
        if (index === 0) return;

        const cells = $(row).find("td");
        if (cells.length > 0) {
          const jobPosting: ofertaIntership = {
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
    jobPostings: ofertaIntership[]
  ): ofertaIntership[] {
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
