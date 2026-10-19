import { FALLBACK_REQUIRED, SKILLS } from '../data/skills.js';

/* ── Where the AI goes ───────────────────────────────────────────
   This file is the seam decision #4 left open. Today `compare()` is
   keyword matching: it looks for each known skill in the two blocks
   of text and scores the overlap. That is deterministic, free, and
   good enough to build the whole upload → compare → display path
   against.

   When you add the model, replace the body of `compare()` (and
   `skillsIn()`, if you want the AI to find skills that are not on
   the list) with an API call. Nothing else has to change: the route
   and the database expect exactly the shape returned below.

   Two things to keep when you do:
   - Keep the return shape { score, band, matchedSkills,
     missingSkills, jdSkills }. The route and the model are written
     against it.
   - Keep a fallback to this keyword path for when the API call
     fails, so a network blip does not break the endpoint.
   ────────────────────────────────────────────────────────────── */

/* A skill counts as present when it appears as a whole word, so
   "Java" does not match inside "JavaScript". */
function hasSkill(text, skill) {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, 'i').test(text);
}

export function skillsIn(text) {
  return SKILLS.filter((skill) => hasSkill(text, skill));
}

export function compare(resumeText, jdText) {
  const jdSkills = skillsIn(jdText);
  const resumeSkills = skillsIn(resumeText);

  /* What the job asks for, or the default set when it names nothing
     we know — otherwise every score would be a meaningless 100. */
  const wanted = jdSkills.length ? jdSkills : FALLBACK_REQUIRED;

  const matchedSkills = wanted.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = wanted.filter((skill) => !resumeSkills.includes(skill));

  const coverage = wanted.length ? matchedSkills.length / wanted.length : 0;

  /* Coverage drives the score, with the rest of the resume's skills
     adding a little credit — a strong resume missing the one thing
     the ad wanted should not read the same as a thin one. */
  const bonus = Math.min(resumeSkills.length / SKILLS.length, 1) * 15;
  const score = Math.max(0, Math.min(100, Math.round(coverage * 85 + bonus)));
  const band = score >= 75 ? 'high' : score >= 55 ? 'mid' : 'low';

  return {
    score,
    band,
    matchedSkills,
    missingSkills,
    jdSkills: wanted
  };
}
