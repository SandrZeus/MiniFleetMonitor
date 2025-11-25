import express from 'express';
import cors from 'cors';
import { authorize } from './middleware/auth.mjs';
import login from './routes/login.mjs';
import robots from './routes/robots.mjs';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const allowedOrigin = `http://localhost:${process.env.VITE_PORT}`;

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/auth/login', login);
app.use('/robots', robots);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

export default app;

