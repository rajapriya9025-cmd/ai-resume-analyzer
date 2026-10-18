/* ──────────────────────────────────────────────────────────────
   Mailroom — the mock "parser".
   Nothing is uploaded anywhere and the PDF is never opened: the
   score comes from what the file is called plus a seeded random,
   so the same file always scores the same.
   ────────────────────────────────────────────────────────────── */

export const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js',
  'Node.js', 'Python', 'Django', 'Flask', 'Java',
  'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git',
  'REST APIs', 'GraphQL', 'HTML', 'CSS', 'Tailwind',
  'Testing', 'Figma', 'Data Structures', 'Accessibility', 'Agile'
];

export const REQUIRED = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Docker', 'AWS', 'CI/CD', 'Git', 'REST APIs',
  'Testing', 'Kubernetes'
];

export const MAX_BYTES = 5 * 1024 * 1024;

export const STEPS = [
  'Opening the envelope',
  'Reading the letter',
  'Underlining the skills',
  'Checking against the role',
  'Stamping the verdict'
];

export const VERDICTS = {
  high: {
    title: 'Ready to post.',
    note: 'This resume matches most of the role. Tighten the bullets with numbers and send it out.'
  },
  mid: {
    title: 'Nearly there.',
    note: 'The core is present, but a few keywords the sorter looks for are missing. Work them into real project lines.'
  },
  low: {
    title: 'Needs another pass.',
    note: 'Too many of the skills the role asks for never appear. Add the ones you have actually used, in context.'
  }
};

export function isPdf(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

export function analyse(file) {
  const rand = mulberry32(hash(file.name + ':' + file.size));

  const found = SKILLS.filter((skill) => {
    const looksLikeItIsInThere = rand() < REQUIRED.includes(skill) ? 0.55 : 0.3;
    return looksLikeItIsInThere;
  }).slice(0, 14);

  const missing = SKILLS.filter((skill) => !found.includes(skill)).slice(0, 8);
  const coverage = found.filter((skill) => REQUIRED.includes(skill)).length / REQUIRED.length;
  const score = Math.max(24, Math.min(97, Math.round(coverage * 100 * 0.78 + rand() * 22)));
  const band = score >= 75 ? 'high' : score >= 55 ? 'mid' : 'low';

  return { name: file.name, score, band, found, missing };
}

/* A 32-bit FNV-1a hash — the same file name and size always seeds
   the same run, which is what makes the score reproducible. */
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* mulberry32: a tiny seeded PRNG, so "random" is repeatable. */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
