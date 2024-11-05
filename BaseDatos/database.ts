import {
  MongoClient,
  Collection,
  OptionalUnlessRequiredId,
  InsertOneResult,
  type Document,
} from "npm:mongodb@6.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class BaseDeDatos {
  private static instance: BaseDeDatos;
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

  public static obtenerInstancia(): BaseDeDatos {
    if (!BaseDeDatos.instance) {
      BaseDeDatos.instance = new BaseDeDatos();
    }
    return BaseDeDatos.instance;
  }

  private async conectarABaseDeDatos(): Promise<void> {
    await this.client.connect();
  }

  public obtenerReferenciaColeccion<T extends Document>(
    name: string
  ): Collection<T> {
    return this.client.db(this.dbName).collection<T>(name);
  }

  public async insertarDocumento<T extends Document>(
    collectionName: string,
    document: OptionalUnlessRequiredId<T>
  ): Promise<InsertOneResult<T>> {
    const collection = this.obtenerReferenciaColeccion<T>(collectionName);
    return await collection.insertOne(document);
  }

  public async cerrarBaseDeDatos(): Promise<void> {
    await this.client.close();
  }
}
