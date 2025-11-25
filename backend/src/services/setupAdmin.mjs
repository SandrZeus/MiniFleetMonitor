import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

import pool from '../db/client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path:__dirname+'/./../../../.env'});

async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const saltRounds = 10;

  if (!email || !password) {
    console.error('Admin email and/or password missing in .env');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, saltRounds);

  await pool.query(
    `INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING;`,
    [email, password_hash]
  );

  console.log(`Admin with email ${email} set up successfully`);
}

export default setupAdmin;
