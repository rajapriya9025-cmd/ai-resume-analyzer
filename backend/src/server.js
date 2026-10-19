import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { connectDb } from './config/db.js';
import analyzeRouter from './routes/analyze.js';
import { HttpError } from './utils.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'mailroom-backend' });
});

app.use('/api/analyze', analyzeRouter);

/* The single place errors become responses. Controllers throw
   HttpError (via badRequest in utils.js) and land here; anything
   unexpected becomes a 500 rather than leaking a stack trace. */
app.use((err, req, res, next) => {
  /* Multer reports its own limits with a code rather than a status. */
  if (err instanceof multer.MulterError) {
    const tooBig = err.code === 'LIMIT_FILE_SIZE';
    return res.status(tooBig ? 413 : 400).json({
      error: tooBig ? 'That file is over 5 MB. Try a lighter PDF.' : err.message
    });
  }

  if (!(err instanceof HttpError)) console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong.' });
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Mailroom backend listening on http://localhost:${port}`);
  });
});
