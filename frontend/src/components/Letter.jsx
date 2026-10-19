import { useEffect, useRef, useState } from 'react';
import { VERDICTS } from '../data/resumeData.js';
import { countUp, cx } from '../lib/utils.js';

/* The letter that comes back out: the score ring, the verdict and
   the two skill lists. Mounts once the envelope has left. */
export default function Letter({ report, onReset }) {
  const numberRef = useRef(null);
  const ringRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    countUp(numberRef.current, report.score);

    /* Two frames: one to let the letter paint at opacity 0, one to
       flip the class, so the fade-in actually transitions. Setting
       the ring's --score here is what animates the conic-gradient
       (see the @property block in styles.css). */
    const frame = requestAnimationFrame(() => {
      setShown(true);
      ringRef.current.style.setProperty('--score', String(report.score));
    });
    return () => cancelAnimationFrame(frame);
  }, [report]);

  const verdict = VERDICTS[report.band];

  return (
    <section className={cx('report-slot', shown && 'is-in')}>
      <article className="letter" data-band={report.band}>
        <div className="letter-postmark" aria-hidden="true">
          <span>Sorted</span>
          <span>by Mailroom</span>
          <span>{report.score}/100</span>
        </div>

        <p className="letter-kicker">Delivery report</p>
        <h1 className="letter-title">{verdict.title}</h1>
        <p className="letter-file">{report.resumeFileName}</p>

        <div className="score-row">
          <div
            className="score-ring"
            ref={ringRef}
            role="img"
            aria-label={`Resume score ${report.score} out of 100`}
          >
            <div className="score-inner">
              <p className="score-number" ref={numberRef}>0</p>
              <p className="score-of">out of 100</p>
            </div>
          </div>
          <div>
            <h2 className="verdict">Score: {report.score}/100</h2>
            <p className="verdict-note">{verdict.note}</p>
          </div>
        </div>

        <SkillsBlock title="Skills the ad asked for, and you have" kind="found" skills={report.matchedSkills} />
        <SkillsBlock title="Skills the ad asked for, missing" kind="missing" skills={report.missingSkills} />

        <div className="letter-foot">
          <p className="letter-note">
            Scored by keyword overlap against the job description you pasted. The AI comparison comes later.
          </p>
          <button className="btn" type="button" onClick={onReset}>Sort another resume</button>
        </div>
      </article>
    </section>
  );
}

function SkillsBlock({ title, kind, skills }) {
  if (!skills.length) {
    return (
      <section className="skills">
        <h2>{title} <span className="count">0</span></h2>
        <p className="verdict-note">Nothing here.</p>
      </section>
    );
  }

  return (
    <section className="skills">
      <h2>{title} <span className="count">{skills.length}</span></h2>
      <ul className="chips">
        {skills.map((skill) => (
          <li className={`chip chip--${kind}`} key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
