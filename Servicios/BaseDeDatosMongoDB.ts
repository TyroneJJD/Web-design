import {
  MongoClient,
  Collection,
  type Document,
} from "npm:mongodb@6.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class BaseDeDatosMongoDB {
  private static instance: BaseDeDatosMongoDB;
  private client: MongoClient;
  private dbName: string = "PROYECTO_WEB";

  private constructor() {
    const uri = env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI no está definido en el archivo .env");
    }
    this.client = new MongoClient(uri);
    this.conectarABaseDeDatos();
  }

  public static obtenerInstancia(): BaseDeDatosMongoDB {
    if (!BaseDeDatosMongoDB.instance) {
      BaseDeDatosMongoDB.instance = new BaseDeDatosMongoDB();
    }
    return BaseDeDatosMongoDB.instance;
  }

  private async conectarABaseDeDatos(): Promise<void> {
    await this.client.connect();
  }

  public obtenerReferenciaColeccion<T extends Document>(
    name: string
  ): Collection<T> {
    return this.client.db(this.dbName).collection<T>(name);
  }

  public obtenerCliente(): MongoClient {
    return this.client;
  }

  public async borrarTodosLosDocumentos<T extends Document>(
    nombreColeccion: string
  ): Promise<number> {
    try {
      const coleccion = this.client.db(this.dbName).collection<T>(nombreColeccion);
      const resultado = await coleccion.deleteMany({});
      console.log(`Se eliminaron ${resultado.deletedCount} documentos de la colección "${nombreColeccion}".`);
      return resultado.deletedCount || 0;
    } catch (error) {
      console.error(`Error al borrar documentos de la colección "${nombreColeccion}":`, error);
      return 0;
    }
  }

  public async cerrarBaseDeDatos(): Promise<void> {
    await this.client.close();
  }
}
