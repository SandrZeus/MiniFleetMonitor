import pool from '../db/client.mjs';
import setupAdmin from './setupAdmin.mjs';
import setupRobots from './setupRobots.mjs';

async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS robots (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'idle',
        lat DOUBLE PRECISION NOT NULL,
        lon DOUBLE PRECISION NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Successfuly database setup');
    await setupAdmin();
    await setupRobots();
  } catch (error) {
     console.error('Error setting up database', error);
  }
}

if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().then(() => process.exit());
}

export default setupDatabase;
