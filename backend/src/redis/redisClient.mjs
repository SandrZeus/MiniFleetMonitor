import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path:__dirname+'/./../../../.env'});


const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});


client.on('error', (error) => console.error('Redis Client error', error));

await client.connect();

export default client;
