import { useEffect, useRef, useState } from 'react';
import Envelope from './components/Envelope.jsx';
import Letter from './components/Letter.jsx';
import { MAX_BYTES, STEPS, analyse, isPdf } from './data/resumeData.js';

/* The whole page is one state machine. `phase` moves
   idle → sorting → sealed → sent → report, and each step is a
   render rather than a DOM class being toggled from a timer. */
export default function App() {
  const [phase, setPhase] = useState('idle');
  const [fileName, setFileName] = useState('');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [shake, setShake] = useState(0);
  const [report, setReport] = useState(null);

  const wrapRef = useRef(null);

  /* The sorting animation: one tick per step, 700ms apart. */
  useEffect(() => {
    if (phase !== 'sorting') return;

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setProgress(Math.min((index / STEPS.length) * 100, 100));
      setStep(Math.min(index, STEPS.length - 1));

      if (index >= STEPS.length) {
        clearInterval(timer);
        setPhase('sealed'); // flap shuts, wax drops
      }
    }, 700);

    return () => clearInterval(timer);
  }, [phase]);

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

  function accept(file) {
    setStatus('');

    if (!isPdf(file)) {
      reject('That is not a PDF. Post a PDF resume and try again.');
      return;
    }
    if (file.size > MAX_BYTES) {
      reject('That file is over 5 MB. Try a lighter PDF.');
      return;
    }

    setFileName(file.name);
    setReport(analyse(file));
    setProgress(0);
    setStep(0);
    setPhase('sorting');
  }

  function reset() {
    setPhase('idle');
    setReport(null);
    setFileName('');
    setStep(0);
    setProgress(0);
    setStatus('');

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
          step={step}
          progress={progress}
          status={status}
          shake={shake}
          wrapRef={wrapRef}
          onAccept={accept}
        />

        {phase === 'report' && report && (
          <Letter report={report} onReset={reset} />
        )}
      </main>

      <footer className="foot">
        <p>Mailroom is a front-end mock: no file is uploaded and the scores are simulated in your browser.</p>
      </footer>
    </div>
  );
}
