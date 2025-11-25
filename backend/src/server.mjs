import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import app from './app.mjs';
import setupDatabase from './services/setupDb.mjs';
import simulate from './services/simulate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });

const PORT = process.env.VITE_PORT_BACKEND;

async function startServer() {
  await setupDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ server });

  wss.on('connection', ws => {
    console.log('Client connected');
  });

  async function liveRobots() {
    const updated = await simulate();

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(updated));
      }
    });
  }

  setInterval(liveRobots, 2000);
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
