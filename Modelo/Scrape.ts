import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";

interface JobPosting {
  company: string;
  role: string;
  location: string;
  applicationLink: string;
  datePosted: string;
}

export class Scraper {
  public async obtenerInterships_SimplifyJobs(): Promise<JobPosting[]> {
    const contenidoObtenido = await this.scrape_SimplifyJobsPage(
      "https://github.com/SimplifyJobs/Summer2025-Internships"
    );
    return this.removerElementosConCamposVacios(contenidoObtenido);
  }

  private async scrape_SimplifyJobsPage(url: string): Promise<JobPosting[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const jobPostings: JobPosting[] = [];
      const rows = $("table tr");

      // Iterar sobre cada fila, comenzando desde la segunda (si la primera es el encabezado)
      rows.each((index, row) => {
        // Omitimos la primera fila si es el encabezado
        if (index === 0) return;

        const cells = $(row).find("td");
        if (cells.length > 0) {
          const jobPosting: JobPosting = {
            company: $(cells[0]).text().trim(),
            role: $(cells[1]).text().trim(),
            location: $(cells[2]).text().trim(),
            applicationLink: $(cells[3]).find("a").attr("href") || "",
            datePosted: $(cells[4]).text().trim(),
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

  private removerElementosConCamposVacios(jobPostings: JobPosting[]): JobPosting[] {
    return jobPostings.filter((posting) => {
      return (
        posting.company.trim() !== "" &&
        posting.role.trim() !== "" &&
        posting.location.trim() !== "" &&
        posting.applicationLink.trim() !== "" &&
        posting.datePosted.trim() !== ""
      );
    });
  }
}
