 
import { MongoClient } from 'mongodb';
import config from '../config/config';

class MongoDBConnector {
  private uri: string;
  private client: MongoClient;
  private connected: boolean = false;

  constructor(connectionString: string) {
    this.uri = connectionString;
    this.client = new MongoClient(this.uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
    });
  }

  public async connect(): Promise<void> {
    if (this.connected) {
      return;
    }
    try {
       
      await this.client.connect();
      this.connected = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw error;
    }
  }

  public async closeConnection(): Promise<void> {
    if (!this.connected) {
      return;
    }
    try {
       
      await this.client.close();
      this.connected = false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw error;
    }
  }
}

export default new MongoDBConnector(config.DATABASE_URL as string);
