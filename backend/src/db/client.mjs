import * as dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path:__dirname+'/./../../../.env'});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default pool;
