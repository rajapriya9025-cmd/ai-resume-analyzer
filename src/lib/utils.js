/* Small helpers shared by the letter: the count-up animation and
   the class-name joiner.

   Note there is no escapeHtml here any more. The vanilla version
   built the letter by pasting a string into innerHTML, so the file
   name had to be escaped by hand. JSX puts text between elements as
   text and React escapes it on the way in, so that helper - and the
   class of bug it existed to prevent - both disappear. */

/* Count the number up while the ring fills. */
export function countUp(node, target) {
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

/* Join the class names we want, dropping the falsy ones, so
   className={cx('envelope', dragging && 'is-dragging')} reads
   the way the old classList.add calls did. */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}
