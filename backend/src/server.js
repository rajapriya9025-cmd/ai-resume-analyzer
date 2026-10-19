import 'dotenv/config';
import app from './app.js';
import { connectDb } from './config/db.js';

/* Local development entry point. On Vercel this file is not used —
   api/index.js exports the app to the serverless runtime instead,
   because a serverless function has no process to listen on. */
const port = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Mailroom backend listening on http://localhost:${port}`);
  });
});
