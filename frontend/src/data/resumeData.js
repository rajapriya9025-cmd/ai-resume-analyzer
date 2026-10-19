/* ──────────────────────────────────────────────────────────────
   What the frontend still needs locally: the upload rules and the
   wording of the verdict.

   The skill list and the scoring used to live here — they moved to
   the backend (backend/src/services/matcher.js), because the server
   now reads the actual PDF and compares it to the job description.
   The frontend no longer guesses at a score; it displays the one it
   is given.
   ────────────────────────────────────────────────────────────── */

export const MAX_BYTES = 5 * 1024 * 1024;

export const VERDICTS = {
  high: {
    title: 'Ready to post.',
    note: 'This resume covers most of what the ad asks for. Tighten the bullets with numbers and send it out.'
  },
  mid: {
    title: 'Nearly there.',
    note: 'The core is present, but some of the keywords the ad asks for never appear. Work them into real project lines.'
  },
  low: {
    title: 'Needs another pass.',
    note: 'Too many of the skills the ad asks for are absent. Add the ones you have actually used, in context.'
  }
};

export function isPdf(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}
