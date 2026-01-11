// app/_lib/typeorm.ts
import "reflect-metadata"; // Required for TypeORM
import { DataSource } from "typeorm";
import { TimerSession } from './entities/TimerSession';

// These environment variables will be provided by Supabase / Vercel integration
// In a Next.js environment, these might be accessed via server-side APIs or functions.
// For now, we assume direct process.env access for demonstration/server functions.
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

// Ensure all required environment variables are set
if (!POSTGRES_HOST || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DATABASE) {
  console.error("Missing PostgreSQL environment variables!");
  throw new Error("Missing PostgreSQL environment variables.");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || "5432", 10), // Default to 5432
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  synchronize: process.env.NODE_ENV !== "production", // Auto-create schema (dev only)
  logging: false, // Set to true to see SQL queries in console
  entities: [TimerSession],
  subscribers: [],
  migrations: [],
});

export const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization", err);
      // In a real app, you might want to handle this more gracefully
      // For now, re-throw to indicate a critical setup failure
      throw err;
    }
  }
  return AppDataSource;
};

export const getTimerSessionRepository = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error("Data Source is not initialized. Call initializeDataSource first.");
  }
  return AppDataSource.getRepository(TimerSession);
};
