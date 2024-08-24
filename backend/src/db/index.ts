import { Sequelize } from "sequelize";
import { initializeModels } from "./models";

class Database {
  #instance: Sequelize;

  constructor() {
    this.#instance = new Sequelize({
      dialect: "mysql",
    });
  }

  async connect(host: string, port: number, username: string, password: string, database: string): Promise<void> {
    this.#instance = new Sequelize({
      host,
      port,
      username,
      password,
      database,
      dialect: "mysql",
      logging: false,
    });
    await this.#instance.authenticate();
    console.log("Connected to the database");
  }

  async disconnect(): Promise<void> {
    await this.#instance.close();
    console.log("Disconnected from the database");
  }

  async initSequelize(): Promise<void> {
    await initializeModels(this.#instance);
    console.log("Initialized models");
  }

  getInstance(): Sequelize {
    return this.#instance;
  }
}

const database = new Database();

export default database;
