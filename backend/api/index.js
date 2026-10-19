import app from '../src/app.js';
import { connectDb } from '../src/config/db.js';

/* Vercel's entry point. Vercel looks for functions in `api/`, and a
   file here that default-exports an Express app is treated as the
   handler for every request the rewrite in vercel.json sends to it.

   The connection is awaited per invocation rather than once at boot:
   a serverless function is frozen between requests, so there is no
   "boot" to hang it off. connectDb is idempotent, so a warm container
   reuses the connection instead of opening a new one. */
export default async function handler(req, res) {
  await connectDb();
  return app(req, res);
}
