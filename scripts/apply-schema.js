/**
 * Direct Supabase PostgreSQL Schema Applier
 * Connects directly using DIRECT_URL or DATABASE_URL and applies schema.sql
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: Neither DIRECT_URL nor DATABASE_URL found in .env');
  process.exit(1);
}

console.log('Connecting to Supabase PostgreSQL at:', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    await client.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL!');

    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema.sql to database...');
    await client.query(sql);
    console.log('✓ Schema applied successfully!');

    // Verify tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('\nVerified Public Tables in Supabase:');
    tablesRes.rows.forEach(r => console.log(' - ' + r.table_name));

    // Verify default merchants
    const merchantRes = await client.query('SELECT merchant_code, business_name, bank_name, account_number, wallet_balance FROM public.merchants;');
    console.log('\nMerchants currently in database:');
    merchantRes.rows.forEach(m => {
      console.log(` - [${m.merchant_code}] ${m.business_name} | ${m.bank_name} (${m.account_number}) | Balance: ₦${m.wallet_balance}`);
    });

    console.log('\n✓ All tables, stored procedures, RLS policies, and seed records are LIVE on Supabase!');
  } catch (err) {
    console.error('Database migration error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
