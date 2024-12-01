import { createPool, Pool } from "npm:mysql2/promise";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class BaseDeDatosMySQL {
  private static instance: BaseDeDatosMySQL;
  private pool: Pool;

  private constructor() {
    const host = env.MYSQL_HOST;
    const user = env.MYSQL_USER;
    const password = env.MYSQL_PASSWORD;
    const database = env.MYSQL_DATABASE;
    const port = Number(env.MYSQL_PORT);

    this.pool = createPool({
      host,
      user,
      password,
      database,
      port, // Incluyendo el puerto en la configuración
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
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

  public async borrarTodosLosDatos(tabla: string): Promise<number> {
    try {
      const query = `DELETE FROM ??`;
      const result: any = await this.ejecutarConsulta(query, [tabla]);
      console.log(`Se eliminaron ${result.affectedRows} filas de la tabla "${tabla}".`);
      return result.affectedRows || 0;
    } catch (error) {
      console.error(`Error al borrar datos de la tabla "${tabla}":`, error);
      return 0;
    }
  }

  public cerrarBaseDeDatos(): Promise<void> {
    return this.pool.end();
  }
}
