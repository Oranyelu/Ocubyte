/**
 * Direct PostgreSQL Database Client for Ocubyte
 * Connects to Supabase PostgreSQL using connection pooling
 */

import pg from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

let pool = null;

export function getDbPool() {
  if (!pool && connectionString) {
    try {
      const parsedUrl = new URL(connectionString);
      pool = new pg.Pool({
        user: decodeURIComponent(parsedUrl.username),
        password: decodeURIComponent(parsedUrl.password),
        host: parsedUrl.hostname,
        port: parsedUrl.port ? Number(parsedUrl.port) : 5432,
        database: parsedUrl.pathname ? parsedUrl.pathname.replace(/^\//, '') : 'postgres',
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
        idleTimeoutMillis: 30000
      });
    } catch {
      pool = new pg.Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
        idleTimeoutMillis: 30000
      });
    }

    pool.on('error', (err) => {
      console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getDbPool();
  if (!p) {
    throw new Error('Database connection string (DATABASE_URL / DIRECT_URL) is not configured in .env');
  }
  return p.query(text, params);
}
