import { createRequire } from 'node:module';

/* pdf-parse ships a CommonJS entry point whose index.js runs a debug
   harness that tries to read a sample PDF from disk when it is not
   being loaded as a module. Importing the inner file directly skips
   that. createRequire lets an ES module pull in a CJS file. */
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

/* Returns the plain text of the PDF, or throws a 400-tagged error if
   the file is not readable as a PDF. */
export async function extractText(buffer) {
  try {
    const { text } = await pdfParse(buffer);
    return text;
  } catch (cause) {
    const error = new Error('Could not read that PDF. Is it a valid, unlocked file?');
    error.status = 400;
    throw error;
  }
}
