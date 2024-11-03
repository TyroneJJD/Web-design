import {
  MongoClient,
  Collection,
  OptionalUnlessRequiredId,
  InsertOneResult,
  type Document,
} from "npm:mongodb@6.1.0";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export class Database {
  private static instance: Database;
  private client: MongoClient;
  private dbName: string = "PROYECTO_WEB";

  private constructor() {
    const uri = env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI no está definido en el archivo .env");
    }
    this.client = new MongoClient(uri);
    this.connect();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connect(): Promise<void> {
    await this.client.connect();
  }

  public getReferenceToCollection<T extends Document>(
    name: string
  ): Collection<T> {
    return this.client.db(this.dbName).collection<T>(name);
  }

  public async insertOne<T extends Document>(
    collectionName: string,
    document: OptionalUnlessRequiredId<T>
  ): Promise<InsertOneResult<T>> {
    const collection = this.getReferenceToCollection<T>(collectionName);
    return await collection.insertOne(document);
  }

  public async close(): Promise<void> {
    await this.client.close();
  }
}
