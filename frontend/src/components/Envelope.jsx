import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/utils.js';

/* The mail cover: the upload surface and the drop target. The
   phase comes from App — 'idle' | 'sorting' | 'sealed' | 'sent' |
   'report'. There is no step list any more: the real request
   decides when this is done. */
export default function Envelope({ phase, fileName, status, shake, wrapRef, onAccept }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [shaking, setShaking] = useState(false);

  /* Rejections arrive as a counter that ticks up; each tick plays
     the shake once and then clears it. */
  useEffect(() => {
    if (!shake) return;
    setShaking(true);
    const timer = setTimeout(() => setShaking(false), 520);
    return () => clearTimeout(timer);
  }, [shake]);

  /* Stop the browser from opening a PDF dropped outside the envelope. */
  useEffect(() => {
    const block = (event) => event.preventDefault();
    window.addEventListener('dragover', block);
    window.addEventListener('drop', block);
    return () => {
      window.removeEventListener('dragover', block);
      window.removeEventListener('drop', block);
    };
  }, []);

  const busy = phase !== 'idle';
  const sealed = phase === 'sealed' || phase === 'sent' || phase === 'report';
  const sent = phase === 'sent' || phase === 'report';

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) onAccept(file);
  }

  function handlePick(event) {
    const file = event.target.files && event.target.files[0];
    if (file) onAccept(file);
    event.target.value = ''; // so re-picking the same file still fires
  }

  return (
    <section
      className={cx('envelope-wrap', sent && 'is-sent')}
      ref={wrapRef}
      aria-label="Upload your resume"
    >
      <div
        className={cx('envelope', dragging && 'is-dragging', sealed && 'is-sealed', shaking && 'is-shaking')}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDragEnd={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flap" aria-hidden="true" />
        <div className="wax" aria-hidden="true">M</div>

        <div className="face">
          <div className="post">
            <div className="postmark" aria-hidden="true">
              <span className="postmark-line">MAILROOM</span>
              <span className="postmark-line postmark-line--big">01</span>
              <span className="postmark-line">SORTED DAILY</span>
            </div>

            <div className="stamp" aria-hidden="true">
              <span className="stamp-top">Resume</span>
              <span className="stamp-big">PDF</span>
              <span className="stamp-bottom">1st class</span>
            </div>
          </div>

          <address className="address">
            <span className="address-label">To</span>
            <span className="address-line">The Hiring Team</span>
            <span className="address-line address-line--soft">Applicant Tracking Dept.</span>
            <span className="address-line address-line--soft">Desk 01, Mailroom</span>
          </address>

          <div className="slot">
            <div className="slot-idle" hidden={busy}>
              <p className="slot-hint">Drop your resume on the envelope</p>
              <p className="slot-sub">PDF · up to 5 MB · compared against your job description</p>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => inputRef.current.click()}
              >
                Choose a file
              </button>
            </div>

            <div className="slot-busy" hidden={!busy}>
              <p className="slot-file">{fileName}</p>
              <div className="progress">
                <div className="progress__bar progress__bar--live" />
              </div>
              <p className="slot-step">Sorting against the job description</p>
            </div>
          </div>

          <p className="status" role="status" aria-live="polite">{status}</p>
        </div>
      </div>

      <input
        type="file"
        ref={inputRef}
        accept="application/pdf,.pdf"
        hidden
        onChange={handlePick}
      />
    </section>
  );
}
