import { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { renderizarVista } from "../../../utilidadesServidor.ts";
import { directorioVistaSeccionActual } from "../Controlador/Controlador.ts";

interface IProblemaCompetitiva {
  nombreProblema: string;
  plataformaProblema: string;
  dificultadProblema: string;
  categoriasProblema: string[];
  urlProblema: string;
}

export class GestorProblemasProgramacionCompetitiva {
  public async BuscadorProblemasProgramacionCompetitiva(context: Context) {
    // Datos de prueba para los problemas
    const problemas: IProblemaCompetitiva[] = [
      {
        nombreProblema: "Two SumXXXXX",
        plataformaProblema: "LeetCode",
        dificultadProblema: "Fácil",
        categoriasProblema: ["Two pointers", "Sortings"],
        urlProblema: "https://leetcode.com/problems/two-sum",
      },
      {
        nombreProblema:
          "Largest Combination With Bitwise AND Greater Than ZeroXXXX",
        plataformaProblema: "LeetCodeXXXXX",
        dificultadProblema: "Medio",
        categoriasProblema: ["Bit Manipulation"],
        urlProblema:
          "https://leetcode.com/problems/largest-combination-with-bitwise-and-greater-than-zero",
      },
      {
        nombreProblema: "Subarray Sum Equals KXXXX",
        plataformaProblema: "LeetCode",
        dificultadProblema: "Medio",
        categoriasProblema: ["Prefix Sum", "Data Structures"],
        urlProblema: "https://leetcode.com/problems/subarray-sum-equals-k",
      },
    ];

    const html = await renderizarVista(
      "Buscador.html",
      { problemas },
      directorioVistaSeccionActual + `/html_ProblemasProgramacionCompetitiva`
    );
    context.response.body = html || "Error al renderizar la página";
  }
}
