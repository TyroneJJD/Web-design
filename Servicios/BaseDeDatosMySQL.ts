import { createPool, Pool } from "npm:mysql2/promise";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Cargar las variables de entorno desde el archivo .env
const env = config();

export class BaseDeDatosMySQL {
  private static instance: BaseDeDatosMySQL;
  private pool: Pool;

  private constructor() {
    const uri = env.MYSQL_URI; 

    this.pool = createPool(uri);
  }

  public static obtenerInstancia(): BaseDeDatosMySQL {
    if (!BaseDeDatosMySQL.instance) {
      BaseDeDatosMySQL.instance = new BaseDeDatosMySQL();
    }
    return BaseDeDatosMySQL.instance;
  }

  public async ejecutarConsulta(query: string, params: any[] = []): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(query, params);
      return result;
    } finally {
      connection.release();
    }
  }

  public cerrarBaseDeDatos(): Promise<void> {
    return this.pool.end();
  }
}
