import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { entities } from "../entities/index";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities,
});

// test connection db
export const testDbConnection = async () => {
  try {
    const connection = await AppDataSource.initialize();
    console.log("Connected to the database", connection.options.database);
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};
