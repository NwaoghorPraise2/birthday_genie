 
 
 
import mongoose from 'mongoose';
import config from '../config/config';

class MongoDBConnector {
  private uri: string;
  private connected: boolean = false;

  constructor(connectionString: string) {
    this.uri = connectionString;
  }

  public async connect() {
    if (this.connected) {
      return;
    }
    try {
      await mongoose.connect(this.uri);
      this.connected = true;
      return mongoose.connection;
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
      await mongoose.disconnect();
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