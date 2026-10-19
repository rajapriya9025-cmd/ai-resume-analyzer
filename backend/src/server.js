import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './config/db.js';
import analyzeRouter from './routes/analyze.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'mailroom-backend' });
});

app.use('/api/analyze', analyzeRouter);

/* Anything thrown inside a route ends up here rather than killing
   the process, so one bad PDF cannot take the server down. */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong.' });
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Mailroom backend listening on http://localhost:${port}`);
  });
});
