import express from 'express';
import cors from 'cors';
import multer from 'multer';
import analyzeRouter from './routes/analyze.js';
import { HttpError } from './utils.js';

/* The Express app on its own, with no `listen`. Keeping it separate
   from server.js is what lets the same app be started two ways: as a
   normal process locally, and as a serverless handler on Vercel. */
const app = express();

/* On Vercel, CLIENT_ORIGIN must be set to the deployed frontend URL.
   The list form also lets you keep localhost while developing. */
const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowed }));
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

export default app;
