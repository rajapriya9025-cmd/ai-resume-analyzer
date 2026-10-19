/* The skill vocabulary. Kept here as the single source of truth for
   the server; the frontend has its own copy for the demo mock.

   When the AI step arrives, this list stops being the whole story —
   see matcher.js. */
export const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js',
  'Node.js', 'Python', 'Django', 'Flask', 'Java',
  'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git',
  'REST APIs', 'GraphQL', 'HTML', 'CSS', 'Tailwind',
  'Testing', 'Figma', 'Data Structures', 'Accessibility', 'Agile'
];

/* Used when a job description names no skills we recognise. */
export const FALLBACK_REQUIRED = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Docker', 'AWS', 'CI/CD', 'Git', 'REST APIs',
  'Testing', 'Kubernetes'
];
