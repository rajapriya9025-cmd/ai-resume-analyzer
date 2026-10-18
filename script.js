/* ──────────────────────────────────────────────────────────────
   Mailroom — front-end mock.
   Nothing is uploaded anywhere. The "sorting" is a timer, and the
   score comes from what the file is called plus a seeded random,
   so the same file always scores the same.
   ────────────────────────────────────────────────────────────── */

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js',
  'Node.js', 'Python', 'Django', 'Flask', 'Java',
  'Spring', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git',
  'REST APIs', 'GraphQL', 'HTML', 'CSS', 'Tailwind',
  'Testing', 'Figma', 'Data Structures', 'Accessibility', 'Agile'
];

const REQUIRED = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Docker', 'AWS', 'CI/CD', 'Git', 'REST APIs',
  'Testing', 'Kubernetes'
];

const MAX_BYTES = 5 * 1024 * 1024;

const STEPS = [
  'Opening the envelope',
  'Reading the letter',
  'Underlining the skills',
  'Checking against the role',
  'Stamping the verdict'
];

const el = {
  wrap: document.getElementById('envelopeWrap'),
  envelope: document.getElementById('envelope'),
  slotIdle: document.getElementById('slotIdle'),
  slotBusy: document.getElementById('slotBusy'),
  slotFile: document.getElementById('slotFile'),
  progressBar: document.getElementById('progressBar'),
  slotStep: document.getElementById('slotStep'),
  status: document.getElementById('status'),
  pickBtn: document.getElementById('pickBtn'),
  fileInput: document.getElementById('fileInput'),
  reportSlot: document.getElementById('reportSlot')
};

/* ── pick a file ─────────────────────────────────────────── */
el.pickBtn.addEventListener('click', () => el.fileInput.click());

el.fileInput.addEventListener('change', () => {
  const file = el.fileInput.files && el.fileInput.files[0];
  if (file) accept(file);
  el.fileInput.value = ''; // so re-picking the same file still fires
});

/* ── drag and drop over the envelope ─────────────────────── */
['dragenter', 'dragover'].forEach((type) => {
  el.envelope.addEventListener(type, (event) => {
    event.preventDefault();
    el.envelope.classList.add('is-dragging');
  });
});

['dragleave', 'dragend'].forEach((type) => {
  el.envelope.addEventListener(type, () => {
    el.envelope.classList.remove('is-dragging');
  });
});

el.envelope.addEventListener('drop', (event) => {
  event.preventDefault();
  el.envelope.classList.remove('is-dragging');
  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (file) accept(file);
});

/* prevent the browser from opening a PDF dropped outside the envelope */
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', (event) => event.preventDefault());

/* ── validation, then the show ───────────────────────────── */
function accept(file) {
  el.status.textContent = '';

  if (!isPdf(file)) {
    reject('That is not a PDF. Post a PDF resume and try again.');
    return;
  }
  if (file.size > MAX_BYTES) {
    reject('That file is over 5 MB. Try a lighter PDF.');
    return;
  }

  runSort(file);
}

function isPdf(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

function reject(message) {
  el.status.textContent = message;
  el.envelope.classList.add('is-shaking');
  setTimeout(() => el.envelope.classList.remove('is-shaking'), 520);
}

/* ── the sorting animation ───────────────────────────────── */
function runSort(file) {
  el.slotIdle.hidden = true;
  el.slotBusy.hidden = false;
  el.slotFile.textContent = file.name;
  el.progressBar.style.width = '0%';
  el.slotStep.textContent = STEPS[0];

  const report = analyse(file);
  let index = 0;

  const timer = setInterval(() => {
    index += 1;
    el.progressBar.style.width = Math.min(index / STEPS.length * 100, 100) + '%';
    el.slotStep.textContent = STEPS[Math.min(index, STEPS.length - 1)];

    if (index >= STEPS.length) {
      clearInterval(timer);
      el.envelope.classList.add('is-sealed');           // flap shuts, wax drops
      setTimeout(() => {
        el.wrap.classList.add('is-sent');               // envelope leaves
        setTimeout(() => showReport(report), 420);
      }, 900);
    }
  }, 700);
}

/* ── the mock "parser" ───────────────────────────────────── */
function analyse(file) {
  const seed = hash(file.name + ':' + file.size);
  const rand = mulberry32(seed);

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

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── the letter that comes back ──────────────────────────── */
const VERDICTS = {
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

function showReport(report) {
  const verdict = VERDICTS[report.band];

  el.reportSlot.innerHTML = `
    <article class="letter" data-band="${report.band}">
      <div class="letter-postmark" aria-hidden="true">
        <span>Sorted</span>
        <span>by Mailroom</span>
        <span>${report.score}/100</span>
      </div>

      <p class="letter-kicker">Delivery report</p>
      <h1 class="letter-title">${verdict.title}</h1>
      <p class="letter-file">${escapeHtml(report.name)}</p>

      <div class="score-row">
        <div class="score-ring" id="scoreRing" role="img"
             aria-label="Resume score ${report.score} out of 100">
          <div class="score-inner">
            <p class="score-number" id="scoreNumber">0</p>
            <p class="score-of">out of 100</p>
          </div>
        </div>
        <div>
          <h2 class="verdict">Score: ${report.score}/100</h2>
          <p class="verdict-note">${verdict.note}</p>
        </div>
      </div>

      ${skillsBlock('Skills found', 'found', report.found)}
      ${skillsBlock('Skills missing', 'missing', report.missing)}

      <div class="letter-foot">
        <p class="letter-note">A mock, not advice: this page never opened the PDF. The real parser reads the text inside it.</p>
        <button class="btn" type="button" id="againBtn">Sort another resume</button>
      </div>
    </article>
  `;

  el.reportSlot.hidden = false;
  requestAnimationFrame(() => el.reportSlot.classList.add('is-in'));

  countUp(document.getElementById('scoreNumber'), report.score);
  requestAnimationFrame(() => {
    document.getElementById('scoreRing').style.setProperty('--score', String(report.score));
  });

  document.getElementById('againBtn').addEventListener('click', reset);
}

function skillsBlock(title, kind, skills) {
  if (!skills.length) {
    return `<section class="skills">
      <h2>${title} <span class="count">0</span></h2>
      <p class="verdict-note">Nothing here.</p>
    </section>`;
  }

  const chips = skills
    .map((skill) => `<li class="chip chip--${kind}">${escapeHtml(skill)}</li>`)
    .join('');

  return `<section class="skills">
    <h2>${title} <span class="count">${skills.length}</span></h2>
    <ul class="chips">${chips}</ul>
  </section>`;
}

/* Count the number up while the ring fills. */
function countUp(node, target) {
  const start = performance.now();
  const duration = 1100;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = String(Math.round(eased * target));
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function reset() {
  el.reportSlot.classList.remove('is-in');
  el.reportSlot.hidden = true;
  el.reportSlot.innerHTML = '';

  el.wrap.classList.remove('is-sent');
  el.envelope.classList.remove('is-sealed');
  el.envelope.classList.remove('is-dragging');
  el.envelope.classList.remove('is-shaking');

  el.slotBusy.hidden = true;
  el.slotIdle.hidden = false;
  el.progressBar.style.width = '0%';
  el.slotStep.textContent = '';
  el.slotFile.textContent = '';
  el.status.textContent = '';

  el.envelope.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
