import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import { BaseDeDatosMongoDB } from "../../../Servicios/BaseDeDatosMongoDB.ts";
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

interface IOfertaIntership {
  _id?: ObjectId;
  compania: string;
  rol: string;
  locacion: string;
  linkFuentePublicacion: string;
  fechaPosteado: string;
}

export class ScraperInterships {
  private collection: Collection<IOfertaIntership>;
  private db: BaseDeDatosMongoDB;
  constructor() {
    this.db = BaseDeDatosMongoDB.obtenerInstancia();
    this.collection = this.db.obtenerReferenciaColeccion<IOfertaIntership>(
      "Interships"
    ) as unknown as Collection<IOfertaIntership>;

    //Por alguna extraña razon si no le pongo esto falla
    this.obtenerOfertasIntershipsV2 =
      this.obtenerOfertasIntershipsV2.bind(this);
    this.visualizarInterships = this.visualizarInterships.bind(this);
    this.visualizarIntershipsEspecifico = this.visualizarIntershipsEspecifico.bind(this);
    this.obtenerOfertaEspecifica = this.obtenerOfertaEspecifica.bind(this);
  }

  public async actualizarOfertasInterships(): Promise<void> {
    await this.db.borrarTodosLosDocumentos("Interships");
    const interships = await this.obtenerInterships_SimplifyJobs();
    interships.forEach(async (intership) => {
      await this.guardarOfertaIntership(intership);
    });
  }

  public async visualizarInterships(context: Context) {
    try {
      const arregloInterships = await this.obtenerOfertasIntershipsV2();
      const html = await renderizarVista(
        "TablaInterships.html",
        { ofertas: arregloInterships },
        directorioVistaSeccionActual + `/html_BuscadorInterships`
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

  private async obtenerOfertaEspecifica(nombreCompania :string ): Promise<IOfertaIntership[]> {
    
      const ofertaDB = await this.collection.findOne({ 
        compania: { $regex: nombreCompania, $options: "i" } 
      });
      return ofertaDB ? [ofertaDB] : [];
    
    
  }
   

  public async visualizarIntershipsEspecifico(context: Context) {
  
      const url = new URL(context.request.url);
      const nombreCompania = url.searchParams.get("nombreCompania");
      

      if (!nombreCompania || nombreCompania.trim() === "") {
        context.response.headers.set(
          "Location",
          "/BuscadorIntershipsV2"
        );
        return;
    
      }
      
      
      const ofertaDB = await this.obtenerOfertaEspecifica(nombreCompania);

      const html = await renderizarVista(
        "TablaInterships.html",
        { ofertas: ofertaDB },
        directorioVistaSeccionActual + `/html_BuscadorInterships`
      );
      context.response.body = html || "Error al renderizar la página";
    
  }

  private async obtenerOfertasIntershipsV2(): Promise<IOfertaIntership[]> {
    const documentos = await this.collection
      .aggregate([
        { $sample: { size: 30 } }, // Obtiene 30 documentos aleatorios
      ])
      .toArray();
    return documentos;
  }

  private async guardarOfertaIntership(
    ofertaDeIntership: IOfertaIntership
  ): Promise<IOfertaIntership | null> {
    try {
      const result = await this.collection.insertOne(ofertaDeIntership);

      return { _id: result, ...ofertaDeIntership };
    } catch (error) {
      console.error("Error al guardar la oferta:", error);
      return null;
    }
  }

  private async obtenerInterships_SimplifyJobs(): Promise<IOfertaIntership[]> {
    const contenidoObtenido = await this.extraerDatos_SimplifyJobsPage(
      "https://github.com/SimplifyJobs/Summer2025-Internships"
    );
    return this.removerElementosConCamposVacios(contenidoObtenido);
  }

  private async extraerDatos_SimplifyJobsPage(
    url: string
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
    jobPostings: IOfertaIntership[]
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
