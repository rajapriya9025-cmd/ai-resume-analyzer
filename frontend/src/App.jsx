import { useEffect, useRef, useState } from 'react';
import Envelope from './components/Envelope.jsx';
import Letter from './components/Letter.jsx';
import { MAX_BYTES, isPdf } from './data/resumeData.js';
import { analyzeResume } from './lib/api.js';

/* The page is one state machine:
   idle → sorting → sealed → sent → report, or → error.
   The "sorting" phase is now a real request to the backend; the
   envelope animation plays over it so a slow PDF still feels
   handled. */
export default function App() {
  const [phase, setPhase] = useState('idle');
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('');
  const [shake, setShake] = useState(0);
  const [report, setReport] = useState(null);

  const wrapRef = useRef(null);
  const requestRef = useRef(0);

  /* Sealed envelope sits a beat, then leaves; the letter follows. */
  useEffect(() => {
    if (phase === 'sealed') {
      const timer = setTimeout(() => setPhase('sent'), 900);
      return () => clearTimeout(timer);
    }
    if (phase === 'sent') {
      const timer = setTimeout(() => setPhase('report'), 420);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  function reject(message) {
    setStatus(message);
    setShake((n) => n + 1);
  }

  async function accept(file) {
    setStatus('');

    if (!isPdf(file)) {
      reject('That is not a PDF. Post a PDF resume and try again.');
      return;
    }
    if (file.size > MAX_BYTES) {
      reject('That file is over 5 MB. Try a lighter PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      reject('Paste the job description first — the score is a comparison.');
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setFileName(file.name);
    setPhase('sorting');

    try {
      const result = await analyzeResume(file, jobDescription);
      if (requestRef.current !== requestId) return; // a newer upload won
      setReport(result);
      setPhase('sealed');
    } catch (error) {
      if (requestRef.current !== requestId) return;
      setPhase('idle');
      reject(error.message);
    }
  }

  function reset() {
    setPhase('idle');
    setReport(null);
    setFileName('');
    setStatus('');
    requestRef.current += 1;

    wrapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="desk">
      <header className="masthead">
        <p className="brand"><span className="brand-mark" aria-hidden="true">✉</span> Mailroom</p>
        <p className="brand-sub">Resume sorter &amp; scorer</p>
      </header>

      <main className="stage">
        <Envelope
          phase={phase}
          fileName={fileName}
          status={status}
          shake={shake}
          wrapRef={wrapRef}
          onAccept={accept}
        />

        {phase !== 'report' && (
          <section className="jd">
            <label className="jd-label" htmlFor="jd">
              The job description
            </label>
            <p className="jd-sub">
              Paste the ad you are applying to. Your resume is scored against what it asks for.
            </p>
            <textarea
              id="jd"
              className="jd-input"
              rows={7}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here…"
              disabled={phase !== 'idle'}
            />
          </section>
        )}

        {phase === 'report' && report && (
          <Letter report={report} onReset={reset} />
        )}
      </main>

      <footer className="foot">
        <p>Mailroom reads your PDF on the server, compares it to the job description, and forgets the text.</p>
      </footer>
    </div>
  );
}
