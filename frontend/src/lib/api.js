/* The one place the frontend talks to the backend. */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* Sends the PDF and the job description as multipart/form-data and
   returns { score, band, matchedSkills, missingSkills, jdSkills }. */
export async function analyzeResume(file, jobDescription) {
  const body = new FormData();
  body.append('resume', file);
  body.append('jobDescription', jobDescription);

  let response;
  try {
    response = await fetch(`${BASE}/api/analyze`, { method: 'POST', body });
  } catch {
    throw new Error('Could not reach the server. Is the backend running on ' + BASE + '?');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `The server refused that (${response.status}).`);
  }
  return data;
}
