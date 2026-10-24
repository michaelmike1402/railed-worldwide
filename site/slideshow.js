(() => {
  'use strict';
  const frames = [...document.querySelectorAll('.frame')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [
    { id: 1, mobile: '50% 43%', desktop: '50% 39%' },
    { id: 2, mobile: '50% 42%', desktop: '50% 39%' },
    { id: 3, mobile: '51% 36%', desktop: '50% 32%' },
    { id: 4, mobile: '53% 44%', desktop: '50% 37%' },
    { id: 5, mobile: '48% 44%', desktop: '50% 42%' },
    { id: 6, mobile: '54% 42%', desktop: '50% 28%' }
  ];
  const sizes = '(max-aspect-ratio: 2/3) 67svh, 100vw';
  const motion = new WeakMap();
  let current = 0, active = 0, timer, generation = 0;
  const sources = id => [640,1280,2400].map(w => `assets/campaign-${id}-${w}.webp ${w}w`).join(', ');
  function stopMotion(frame) {
    motion.get(frame)?.cancel();
    motion.delete(frame);
  }
  function animatePhoto(frame) {
    stopMotion(frame);
    if (document.hidden || reducedMotion.matches || !frame.animate) return;
    const zoomOut = Number(frame.dataset.slide) % 2 === 0;
    motion.set(frame, frame.animate([
      { transform: `scale(${zoomOut ? 1.035 : 1})` },
      { transform: `scale(${zoomOut ? 1 : 1.035})` }
    ], { duration: 6350, easing: 'linear', fill: 'forwards' }));
  }
  function prepare(frame, slide) {
    // Reset only after the outgoing image is fully transparent.
    stopMotion(frame);
    frame.dataset.slide = slide.id;
    frame.style.setProperty('--focal', slide.mobile);
    frame.style.setProperty('--desktop-focal', slide.desktop);
    frame.sizes = sizes;
    frame.srcset = sources(slide.id);
    frame.src = `assets/campaign-${slide.id}-1280.webp`;
    return frame.decode();
  }
  function schedule(delay = 5000) {
    clearTimeout(timer);
    if (document.hidden || reducedMotion.matches) return;
    const token = ++generation;
    const next = (current + 1) % slides.length;
    const incoming = frames[1 - active];
    // The hidden frame fetches and decodes the next image during the five-second hold.
    const ready = prepare(incoming, slides[next]).then(() => true, () => false);
    timer = setTimeout(async () => {
      const loaded = await ready;
      if (token !== generation || document.hidden || reducedMotion.matches) return;
      if (!loaded) { current = next; schedule(); return; }
      animatePhoto(incoming);
      incoming.classList.add('is-visible');
      frames[active].classList.remove('is-visible');
      active = 1 - active;
      current = next;
      // Let the outgoing layer finish fading before reusing it for preloading.
      timer = setTimeout(() => {
        if (token !== generation) return;
        schedule(3650);
      }, 1350);
    }, delay);
  }
  function restart() {
    ++generation;
    clearTimeout(timer);
    frames.forEach((frame, i) => {
      stopMotion(frame);
      frame.classList.toggle('is-visible', i === active);
    });
    animatePhoto(frames[active]);
    schedule();
  }
  frames[0].style.setProperty('--focal', slides[0].mobile);
  frames[0].style.setProperty('--desktop-focal', slides[0].desktop);
  document.addEventListener('visibilitychange', restart);
  reducedMotion.addEventListener('change', restart);
  animatePhoto(frames[0]);
  schedule();
})();
