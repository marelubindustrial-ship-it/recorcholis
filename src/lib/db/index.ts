import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

/**
 * Cliente Drizzle. Si no hay DATABASE_URL disponible, `db` queda en null
 * y los repositorios activan su modo demo en memoria.
 */
const connectionString = process.env.DATABASE_URL;

let client: mysql.Connection | null = null;

export async function getDb() {
  if (!connectionString) return null;
  if (!client) {
    client = await mysql.createConnection(connectionString);
  }
  return drizzle(client, { schema, mode: 'default' });
}

export { schema };
